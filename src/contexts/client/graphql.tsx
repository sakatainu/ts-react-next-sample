import { useMemo, type FC } from 'react';
import { useSigninCheck, useFirestore } from 'reactfire';
import { IdTokenResult, getAuth, getIdTokenResult } from 'firebase/auth';
import {
  collection,
  where,
  query,
  documentId,
  onSnapshot,
  type Firestore,
} from 'firebase/firestore';

import { AuthConfig, authExchange } from '@urql/exchange-auth';
import {
  makeOperation,
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange,
  Provider,
} from 'urql';
import { decodeJwt, SignJWT } from 'jose';
import FirebaseFirestoreProvider from './firebase/firestore';

const baseUrl = process.env.NEXT_PUBLIC_GRAPHQL_BASE_URL;
if (baseUrl === undefined)
  throw new Error('GRAPHQL_BASE_URL must not be undefined.');
const url = `${baseUrl}/v1/graphql`;

const waitSetClaims = async (db: Firestore, id: string): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const usersQuery = query(
      collection(db, 'users'),
      where(documentId(), '==', id)
    );
    const unsubscribe = onSnapshot(
      usersQuery,
      (snap) => {
        const [user] = snap.docs;
        if (user === undefined) return;
        unsubscribe();
        resolve();
      },
      reject
    );
  });
};

const getIdToken = async (firestore: Firestore) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user == null) return null;

  // login
  const idTokenResult0 = await getIdTokenResult(user);
  if (idTokenResult0.claims?.['https://hasura.io/jwt/claims'])
    return idTokenResult0;

  // signup and reload
  const idTokenResult1 = await getIdTokenResult(user, true);
  if (idTokenResult1.claims?.['https://hasura.io/jwt/claims'])
    return idTokenResult1;

  // just signup
  await waitSetClaims(firestore, user.uid);
  const idTokenResult2 = await getIdTokenResult(user, true);
  return idTokenResult2;
};

const authConfig = (firestore: Firestore): AuthConfig<IdTokenResult> => ({
  /*
  didAuthError: ({ error }) => {
    return error.graphQLErrors.some(
      e => e.response.status === 401,
    );
  },
  */
  getAuth: async () => {
    const idTokenResult = await getIdToken(firestore);

    if (process.env.NODE_ENV === 'production') return idTokenResult;

    if (typeof process.env.NEXT_PUBLIC_GRAPHQL_JWT_SECRET !== 'string')
      throw new Error('GRAPHQL_JWT_SECRET must be string');

    const accessToken = idTokenResult?.token;

    if (!idTokenResult || typeof accessToken !== 'string')
      throw new Error('token must be string');

    const payload = decodeJwt(accessToken);
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(
        new TextEncoder().encode(process.env.NEXT_PUBLIC_GRAPHQL_JWT_SECRET)
      );
    idTokenResult.token = jwt;

    return idTokenResult;
  },
  willAuthError: ({ authState: idTokenResult }) => {
    if (idTokenResult == null) return true;
    if (!idTokenResult.claims?.['https://hasura.io/jwt/claims']) return true;

    if (idTokenResult.expirationTime) {
      const expirationDate = new Date(idTokenResult.expirationTime);
      return expirationDate < new Date();
    }

    return !idTokenResult.token;
  },
  addAuthToOperation: ({ authState: idTokenResult, operation }) => {
    if (!idTokenResult?.token) return operation;

    const fetchOptions =
      typeof operation.context.fetchOptions === 'function'
        ? operation.context.fetchOptions()
        : operation.context.fetchOptions || {};

    return makeOperation(operation.kind, operation, {
      ...operation.context,
      fetchOptions: {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          authorization: `Bearer ${idTokenResult.token}`,
        },
      },
    });
  },
});

const Wrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status, data: signInCheckResult } = useSigninCheck();
  const firestore = useFirestore();
  const client = useMemo(() => {
    if (status === 'loading') return null;
    if (!signInCheckResult.signedIn) return null;
    return createClient({
      url,
      exchanges: [
        dedupExchange,
        cacheExchange,
        authExchange(authConfig(firestore)),
        fetchExchange,
      ],
    });
  }, [status, signInCheckResult, firestore]);
  if (client === null) return <>{children}</>;
  return <Provider value={client}>{children}</Provider>;
};

const Wrapped: FC<{ children: React.ReactNode }> = ({ children }) => (
  <FirebaseFirestoreProvider>
    <Wrapper>{children}</Wrapper>
  </FirebaseFirestoreProvider>
);

export default Wrapped;

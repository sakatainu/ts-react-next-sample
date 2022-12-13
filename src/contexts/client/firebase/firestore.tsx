import type { FC, ReactNode } from 'react';
import {
  initializeFirestore,
  // enableIndexedDbPersistence,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import { useInitFirestore, FirestoreProvider } from 'reactfire';
import AuthWrapper from './auth';

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const { status, data: firestore } = useInitFirestore(async (firebaseApp) => {
    const db = await Promise.resolve(initializeFirestore(firebaseApp, {}));
    // await enableIndexedDbPersistence(db);
    if (process.env.NODE_ENV === 'production') return db;

    if (typeof process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST !== 'string')
      return db;
    if (typeof process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT !== 'string')
      return db;

    const host = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST;
    const port = Number(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT);

    connectFirestoreEmulator(db, host, port);
    return db;
  });

  if (status === 'loading' || firestore == null) return <p>loading</p>;

  return <FirestoreProvider sdk={firestore}>{children}</FirestoreProvider>;
};

const Wrapped: FC<{ children: ReactNode }> = ({ children }) => (
  <AuthWrapper>
    <Provider>{children}</Provider>
  </AuthWrapper>
);

export default Wrapped;

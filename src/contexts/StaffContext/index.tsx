import NextError from 'next/error';
import SignedInUserContext, {
  useSignedInUserContext,
} from '~/contexts/SignedInUserContext';

const Container = ({ children }: { children?: React.ReactNode }) => {
  const {
    user: { role },
  } = useSignedInUserContext();

  if (role === 'staff') return <>{children}</>;
  return <NextError statusCode={404} />;
};

export type StaffContextProps = {
  children?: React.ReactNode;
  redirect?: string;
};

const StaffContext = ({ redirect, children }: StaffContextProps) => (
  <SignedInUserContext redirect={redirect}>
    <Container> {children}</Container>
  </SignedInUserContext>
);

export default StaffContext;

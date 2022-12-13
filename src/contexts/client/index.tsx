import { type FC } from 'react';
import Wrapper from './graphql';

const Wrapped: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Wrapper>{children}</Wrapper>
);

export default Wrapped;

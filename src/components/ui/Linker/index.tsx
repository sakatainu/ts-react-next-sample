import { forwardRef } from 'react';
import Link, { LinkProps } from '~/components/ui/Link';

export type LinkerProps = Omit<LinkProps, 'href'> & {
  href?: LinkProps['href'];
};

const Linker = forwardRef<HTMLAnchorElement, LinkerProps>(
  ({ href, children, ...rest }, ref) => {
    if (href) {
      return (
        <Link ref={ref} href={href} {...rest}>
          {children}
        </Link>
      );
    }

    return <>{children}</>;
  }
);

Linker.displayName = 'Linker';

export default Linker;

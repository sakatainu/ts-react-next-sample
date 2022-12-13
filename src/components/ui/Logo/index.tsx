import { Box, BoxProps, SxProps, Theme } from '@mui/material';
import { forwardRef } from 'react';
import Link, { LinkProps } from '~/components/ui/Link';

const defaultLinkPath = '/';
const defaultLogoSrc = '/logo.svg';
const defaultSx: SxProps<Theme> = {
  display: 'inline-block',
  width: 200,
  height: 64,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
};

type BaseLogoProps = {
  src?: string;
} & BoxProps;

export type LogoProps =
  | ({
      unlink: true;
    } & BaseLogoProps)
  | ({
      unlink?: false;
      href?: LinkProps['href'];
    } & BaseLogoProps &
      Omit<LinkProps, 'href'>);

const Logo = forwardRef<unknown, LogoProps>((props, ref) => {
  const { unlink, src = defaultLogoSrc, sx, ...rest } = props;

  const mergedSx = {
    backgroundImage: `url(${src})`,
    ...defaultSx,
    ...sx,
  };

  if (unlink) {
    return <Box sx={mergedSx} ref={ref} {...rest} />;
  }

  return (
    <Box
      component={Link}
      sx={mergedSx}
      href={defaultLinkPath}
      ref={ref}
      {...rest}
    />
  );
});
Logo.displayName = 'Logo';

export default Logo;

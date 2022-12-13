import { Badge, SvgIconProps } from '@mui/material';
import { Bell as BellIcon } from '~/components/icon';

const NotificationIcon = (props: SvgIconProps) => {
  const badgeCount = 1000;
  return (
    <Badge badgeContent={badgeCount} color="error">
      <BellIcon {...props} />
    </Badge>
  );
};
export default NotificationIcon;

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconButton, Link, Menu, MenuItem, Typography } from '@mui/material';
import { useRef } from 'react';
import { useToggle } from 'react-use';
import { Group } from '~/hooks/useGroups';

export type AccountContextMenuProps = {
  value: Group;
};

const AccountContextMenu = ({ value }: AccountContextMenuProps) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [openMenu, setOpenMenu] = useToggle(false);

  return (
    <>
      <IconButton
        ref={anchorRef}
        size="small"
        onClick={() => setOpenMenu(true)}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        anchorEl={anchorRef.current}
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={Link} href={`/home/groups/${value.id}/info`}>
          <Typography variant="body2">アカウントの編集</Typography>
        </MenuItem>
        <MenuItem component={Link} href={`/home/groups/${value.id}/members`}>
          <Typography variant="body2">メンバー管理</Typography>
        </MenuItem>
        {/* <MenuItem>
          <Typography variant="body2">アカウントの切替</Typography>
        </MenuItem> */}
      </Menu>
    </>
  );
};
export default AccountContextMenu;

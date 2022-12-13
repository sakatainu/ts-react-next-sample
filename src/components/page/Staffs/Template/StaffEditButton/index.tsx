import * as React from 'react';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { InvitingStaff, Staff } from '../../type';

export type StaffEditButtonProps = {
  value: Staff | InvitingStaff;
  onClickDeleteStaff?: (value: Staff, e: React.MouseEvent<HTMLElement>) => void;
};

const StaffEditButton = ({
  value,
  onClickDeleteStaff,
}: StaffEditButtonProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
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
        {'id' in value && (
          <MenuItem onClick={(e) => onClickDeleteStaff?.(value, e)}>
            <Typography variant="body2">スタッフの削除</Typography>
          </MenuItem>
        )}
        <MenuItem>
          <Typography variant="body2">招待を取り消し</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body2">招待を再送</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
export default StaffEditButton;

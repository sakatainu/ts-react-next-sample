import { SelectMembershipsQuery } from '@/generated/graphql';
import { Menu, MenuItem, MenuProps, Typography } from '@mui/material';

export type MemberContextMenuProps = MenuProps & {
  member: SelectMembershipsQuery['memberships'][number] | null;
  onClickDeleteMember?: React.MouseEventHandler<HTMLLIElement>;
  onClickReinvite?: React.MouseEventHandler<HTMLLIElement>;
};

const MemberContextMenu = ({
  member,
  onClickDeleteMember,
  onClickReinvite,
  ...rest
}: MemberContextMenuProps) => {
  // const isInviting = Boolean(member?.groupInvitation);

  if (!member) return null;

  return (
    <Menu
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
      {...rest}
    >
      <MenuItem onClick={onClickDeleteMember}>
        <Typography variant="body2">ユーザーの削除</Typography>
      </MenuItem>
      {/* TODO: 招待の再送 */}
      {/* {isInviting && (
        <MenuItem key="2" onClick={onClickReinvite}>
          <Typography variant="body2">招待を再送</Typography>
        </MenuItem>
      )} */}
    </Menu>
  );
};

export default MemberContextMenu;

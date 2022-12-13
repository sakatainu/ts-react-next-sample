import { List, ListItemButton } from '@mui/material';
import Link from '~/components/ui/Link';
import { useGroupContext } from '~/contexts/GroupContext';

type Path = 'info' | 'members';

const groupHomePathname = '/home/groups/[groupId]';

const groupInfoNavItems = [
  {
    path: 'info',
    label: 'アカウント',
    link: `${groupHomePathname}/info`,
  },
  {
    path: 'members',
    label: 'ユーザー',
    link: `${groupHomePathname}/members`,
  },
] as const;

export type GroupInfoNavProps = {
  currentPath: Path;
};

const GroupInfoNav = ({ currentPath }: GroupInfoNavProps) => {
  const {
    group: { id },
  } = useGroupContext();

  return (
    <List sx={{ width: 200 }}>
      {groupInfoNavItems.map((v) => (
        <ListItemButton
          key={v.path}
          LinkComponent={Link}
          href={v.link.replace('[groupId]', id)}
          selected={v.path === currentPath}
          sx={{
            mb: 1,
            position: 'relative',
            '&.Mui-selected::after': {
              display: 'block',
              content: '""',
              position: 'absolute',
              width: 8,
              height: 1,
              left: 0,
              backgroundColor: 'primary.main',
            },
          }}
        >
          {v.label}
        </ListItemButton>
      ))}
    </List>
  );
};

export default GroupInfoNav;

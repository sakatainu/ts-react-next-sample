import { Help as HelpIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Header from '~/components/ui/AppHeader';
import Row from '~/components/ui/Row';
import useLogout from '~/hooks/useLogout';
import AvatarMenuButton from './AvatarMenuButton';
import SettingsMenuButton from './SettingsMenuButton';

const AppHeader = () => {
  const logout = useLogout();

  const handleClickLogout = () => {
    (async () => logout())();
  };

  return (
    <Header>
      <Row
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ ml: 'auto' }}
      >
        <IconButton color="primary" aria-label="help" component="label">
          <HelpIcon />
        </IconButton>
        <SettingsMenuButton />
        <AvatarMenuButton onClickLogout={handleClickLogout} />
      </Row>
    </Header>
  );
};

export default AppHeader;

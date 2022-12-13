import * as React from 'react';
import { Box, Button, Stack, Typography, TextField } from '@mui/material';

import Container from '~/components/ui/Container';
import members from '~/services/members';

const user = members[0];

const Profile = () => (
  <>
    <Box
      height={48}
      sx={{
        borderBottom: 1,
        backgroundColor: (theme) => theme.palette.background.default,
        borderColor: 'divider',
      }}
    >
      <Container>
        <Typography p={1} variant="h6" component="h1">
          プロフィール管理
        </Typography>
      </Container>
    </Box>
    <Box
      sx={{
        py: 2,
        borderBottom: 1,
        backgroundColor: 'background.paper',
        borderColor: 'divider',
      }}
    >
      <Container sx={{ height: '100vh' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box sx={{ py: 3 }}>
            <Typography variant="h5">{user.name}</Typography>
          </Box>
        </Stack>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="standard-basic"
            label="氏名"
            variant="standard"
            defaultValue={user.name}
          />
        </Box>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="standard-basic"
            label="Email"
            variant="standard"
            defaultValue={user.mailAddress}
          />
        </Box>
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <Box sx={{ p: 2 }}>
            <Button variant="contained"> 更新する </Button>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <Box sx={{ p: 2 }}>
            <Button variant="contained" color="secondary">
              パスワード変更のメールを送信する
            </Button>
          </Box>
        </Stack>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="standard-basic"
            label="新しいパスワード"
            variant="standard"
          />
        </Box>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            id="standard-basic"
            label="新しいパスワード（確認）"
            variant="standard"
          />
        </Box>
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <Box sx={{ p: 2 }}>
            <Button variant="contained"> パスワードを更新する </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  </>
);
export default Profile;

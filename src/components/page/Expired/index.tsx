import { InsertEmoticon as InsertEmoticonIcon } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import Container from '~/components/ui/Container';

const Expired = () => (
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
          無料トライアル終了
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
          justifyContent="space-around"
          mb={4}
        >
          <Box sx={{ m: 4 }}>
            <Typography variant="h5"> 大変申し訳ございません。 </Typography>
            <Typography variant="h5">
              無料トライアル期間を過ぎてしまいました。
            </Typography>
          </Box>
          <InsertEmoticonIcon color="info" sx={{ fontSize: 80 }} />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Box
            sx={{
              p: 4,
              width: 500,
              border: '1px solid grey',
              borderRadius: '16px',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ textAlign: 'left' }}>
              継続利用をご希望の方は、お手数ですが当社営業担当までお問合せください。
              また、初めての方は、下記、問合せフォームからご連絡いただくか、担当者窓口まで、
              お問合せください。
            </Typography>
            <Button
              href="https://lp.hooolders.com/contact"
              size="large"
              variant="outlined"
              sx={{ my: 4, fontWeight: 'bold' }}
            >
              お問合せ
            </Button>
            <Typography variant="h6" sx={{ my: 4 }}>
              営業担当連絡先：info@figurout.co.jp
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  </>
);
export default Expired;

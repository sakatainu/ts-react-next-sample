import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import Container from '~/components/ui/Container';
import indicators from '~/services/indicators';

const comparingItems = [
  { name: '上場市場', code: 'market' },
  { name: '時価総額', code: 'sum' },
  { name: '株価', code: 'stockPrice' },
  { name: 'PER(会社予測)', code: 'per' },
  { name: '平均出来高', code: 'averageVolume' },
  { name: '平均売買代金', code: 'averageTradingValue' },
  { name: '対TOPIX変動', code: 'vsTopix' },
  { name: '対マザーズ変動', code: 'vsMothers' },
  { name: '対競合5社変動', code: 'vsCompetitors' },
  { name: '株主数', code: 'holdersNum' },
  { name: '実質流動株式数', code: 'fluidStocks' },
  { name: '機関投資家比率', code: 'institutionalRatio' },
  { name: '実質流動時価総額', code: 'fluidTotalValue' },
];

const StyledCard = styled(Card)({
  borderRadius: 0,
  position: `relative`,
  margin: `auto`,
  minWidth: 142,
  maxWidth: 250,
  overflow: `hidden`,
});

const Indicators = () => (
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
          指標比較
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
            <Typography>
              {
                '比較対象銘柄の選択はここ。カラム幅の都合上、自社入れて< 6としたい'
              }
            </Typography>
          </Box>
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={0}
        >
          <Box>
            <StyledCard>
              <CardContent
                sx={{
                  fontWeight: 'bold',
                  bgcolor: 'primary.main',
                  color: 'white',
                  textAlign: 'left',
                }}
              >
                銘柄コード
              </CardContent>
              <Divider color="white" />
              <CardContent
                sx={{
                  fontWeight: 'bold',
                  bgcolor: 'primary.main',
                  color: 'white',
                  textAlign: 'left',
                }}
              >
                会社名
              </CardContent>
              {comparingItems.map((i) => (
                <div key={i.code}>
                  <CardContent>{i.name}</CardContent>
                  <Divider />
                </div>
              ))}
            </StyledCard>
          </Box>
          {indicators.map((i) => (
            <Box key={i.id}>
              <StyledCard>
                <CardContent
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'primary.main',
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  {i.code}
                </CardContent>
                <Divider color="white" />
                <CardContent
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: 'primary.main',
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  {i.name}
                </CardContent>
                <div>
                  <CardContent sx={{ textAlign: 'center' }}>
                    {i.market}
                  </CardContent>
                  <Divider />
                </div>
                <div>
                  <CardContent sx={{ textAlign: 'right' }}>
                    {i.sum.toLocaleString()}
                  </CardContent>
                  <Divider />
                </div>
                <div>
                  <CardContent sx={{ textAlign: 'right' }}>
                    {i.stockPrice.toLocaleString()}
                  </CardContent>
                  <Divider />
                </div>
                <div>
                  <CardContent sx={{ textAlign: 'right' }}>
                    {i.per.toLocaleString()}
                  </CardContent>
                  <Divider />
                </div>
                <div>
                  <CardContent sx={{ textAlign: 'right' }}>
                    {i.averageVolume.toLocaleString()}
                  </CardContent>
                  <Divider />
                </div>
                <div>
                  <CardContent sx={{ textAlign: 'right' }}>
                    {i.averageVolumeTradingValue.toLocaleString()}
                  </CardContent>
                  <Divider />
                </div>
                <div>
                  <CardContent sx={{ textAlign: 'right' }}>
                    {i.vsTopix.toLocaleString()}
                  </CardContent>
                  <Divider />
                </div>
                <div>
                  <CardContent sx={{ textAlign: 'right' }}>
                    {i.vsMothers.toLocaleString()}
                  </CardContent>
                  <Divider />
                </div>
                <div>
                  <CardContent sx={{ textAlign: 'right' }}>
                    {i.vsCompetitors.toLocaleString()}
                  </CardContent>
                  <Divider />
                </div>
                <div>
                  <CardContent sx={{ textAlign: 'right' }}>
                    {i.holdersNum.toLocaleString()}
                  </CardContent>
                  <Divider />
                </div>
                <div>
                  <CardContent sx={{ textAlign: 'right' }}>
                    {i.fluidStocks.toLocaleString()}
                  </CardContent>
                  <Divider />
                </div>
                <div>
                  <CardContent sx={{ textAlign: 'right' }}>
                    {i.institutionalRatio}
                  </CardContent>
                  <Divider />
                </div>
                <div>
                  <CardContent sx={{ textAlign: 'right' }}>
                    {i.fluidTotalValue.toLocaleString()}
                  </CardContent>
                  <Divider />
                </div>
              </StyledCard>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  </>
);
export default Indicators;

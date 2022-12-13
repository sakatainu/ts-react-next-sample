import {
  VisibilityOff as VisibilityOffIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  MenuItem,
  Paper,
  Radio,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  categoryMarkerPin,
  indicatorMap,
  IndicatorType,
  stockIndexMap,
  StockIndexType,
  technicalMap,
  TechnicalType,
} from '~/components/page/Compare/types';
import Avatar from '~/components/ui/Avatar';
import HtmlTooltip from '~/components/ui/HtmlTooltip';
import MenuButton, { MenuButtonProps } from '~/components/ui/MenuButton';
import Row from '~/components/ui/Row';
import { removeLegalType } from '~/utils';

export type GraphEditorTopToolbarProps = {
  value: {
    stockIssue: StockIssue;
    selectedIndicator: IndicatorType;
    selectedTechnicals: TechnicalType[];
    selectedStockIndexes: string[];
    showNewsMarker: boolean;
  };
  onChangeIndicator: MenuButtonProps['onChange'];
  onChangeTechnicals: MenuButtonProps['onChange'];
  onChangeStockIndexes: MenuButtonProps['onChange'];
  onClickShowNewsMarker: React.MouseEventHandler<HTMLButtonElement>;
};

const GraphEditorTopToolbar = ({
  value: {
    stockIssue,
    selectedIndicator,
    selectedTechnicals,
    selectedStockIndexes,
    showNewsMarker,
  },
  onChangeIndicator,
  onChangeStockIndexes,
  onChangeTechnicals,
  onClickShowNewsMarker,
}: GraphEditorTopToolbarProps) => (
  <Paper
    variant="outlined"
    sx={{
      display: 'flex',
      alignItems: 'center',
      height: 48,
      px: 2,
      gap: 0.5,
    }}
  >
    <Avatar
      label={stockIssue.name}
      src={stockIssue.avatar}
      sx={{
        width: 28,
        height: 28,
        mr: 1,
        fontSize: 9,
      }}
    />
    <Tooltip title={stockIssue.name}>
      <Typography
        sx={{
          width: 240,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {`(${stockIssue.code}) ${removeLegalType(stockIssue.name)}`}
      </Typography>
    </Tooltip>
    <Divider orientation="vertical" variant="middle" flexItem />
    <MenuButton label="指標" onChange={onChangeIndicator}>
      {Object.entries(indicatorMap).map(([k, v]) => (
        <MenuItem key={k} component="label">
          <Radio
            size="small"
            disableRipple
            sx={{ p: 0, mr: 1 }}
            value={k}
            name="indicator"
            checked={k === selectedIndicator}
          />
          {v}
        </MenuItem>
      ))}
    </MenuButton>
    <MenuButton label="テクニカル" onChange={onChangeTechnicals}>
      {Object.entries(technicalMap).map(([k, v]) => (
        <MenuItem key={k} component="label">
          <Checkbox
            size="small"
            disableRipple
            sx={{ p: 0, mr: 1 }}
            value={k}
            name="technical"
            checked={selectedTechnicals.includes(k as TechnicalType)}
          />
          {v}
        </MenuItem>
      ))}
    </MenuButton>
    <MenuButton label="指数比較" onChange={onChangeStockIndexes}>
      {Object.entries(stockIndexMap).map(([k, v]) => (
        <MenuItem key={k} component="label">
          <Checkbox
            size="small"
            disableRipple
            sx={{ p: 0, mr: 1 }}
            value={k}
            name="stockIndex"
            checked={selectedStockIndexes.includes(k as StockIndexType)}
          />
          {v}
        </MenuItem>
      ))}
    </MenuButton>
    <HtmlTooltip
      title={
        <Paper>
          <Stack
            sx={{
              width: 180,
              p: 2,
              gap: 1,
              fontSize: '0.8rem',
            }}
          >
            <Typography variant="caption">
              出来高インパクト上位30件を表示します。
            </Typography>
            {categoryMarkerPin.map((v) => (
              <Row
                key={v.type}
                sx={{
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: v.markerColor,
                  }}
                />
                <Box>{v.label}</Box>
              </Row>
            ))}
          </Stack>
        </Paper>
      }
    >
      <Button
        size="small"
        variant={showNewsMarker ? 'contained' : 'outlined'}
        endIcon={
          showNewsMarker ? <VisibilityOutlinedIcon /> : <VisibilityOffIcon />
        }
        disableElevation
        onClick={onClickShowNewsMarker}
      >
        ニュース表示
      </Button>
    </HtmlTooltip>
  </Paper>
);

export default GraphEditorTopToolbar;

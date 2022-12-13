import {
  CandlestickChartOutlined as CandlestickChartOutlinedIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  OpenInNew as OpenInNewIcon,
  ShowChart as ShowChartIcon,
  VisibilityOff as VisibilityOffIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  tooltipClasses,
  Typography,
} from '@mui/material';
import { Instance } from '@popperjs/core';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import { SeriesOption } from 'echarts';
import { round } from 'mathjs';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useToggle } from 'react-use';
import { ROC } from 'technicalindicators';
import AsyncPresenter from '~/components/ui/AsyncPresenter';
import Avatar from '~/components/ui/Avatar';
import HtmlTooltip from '~/components/ui/HtmlTooltip';
import Link from '~/components/ui/Link';
import MultiSelectMenu from '~/components/ui/MultiSelectMenu';
import NewsItemTable from '~/components/ui/NewsItemTable';
import Row from '~/components/ui/Row';
import StockGraphEditor, {
  StockGraphEditorProps,
} from '~/components/ui/StockGraphEditor';
import { CategoryType, NewsItem } from '~/hooks/useNewsItems';
import { removeLegalType, toDateString } from '~/utils';

const defaultEndDate = dayjs().toDate();
const defaultZoomEndDate = defaultEndDate;

const candlestickUpColor = '#26a69a';
const candlestickDownColor = '#ef5350';
const candlestickStyle = {
  color: candlestickUpColor,
  borderColor: candlestickUpColor,
  color0: candlestickDownColor,
  borderColor0: candlestickDownColor,
};

const categoryMarkerPin: {
  type: CategoryType;
  label: string;
  markerColor: string;
}[] = [
  {
    type: 'news',
    label: 'ニュース',
    markerColor: '#0091EA',
  },
  {
    type: 'ir',
    label: '適時開示情報',
    markerColor: '#9E9D24',
  },
  {
    type: 'groupEvent',
    label: '登録イベント',
    markerColor: '#EEFF41',
  },
];

const getMarkerStyle = (category: CategoryType) => {
  const indexMap = Object.fromEntries(
    categoryMarkerPin.map((v) => [v.type, v])
  );
  return {
    value: '',
    itemStyle: {
      color: indexMap[category].markerColor,
    },
  };
};

export const technicalIndicatorTypes = [
  'turnover',
  'sma1d',
  'sma5w',
  'sma13w',
  'sma26w',
] as const;

export type TechnicalIndicatorType = typeof technicalIndicatorTypes[number];

const seriesTypes = ['candlestick', 'line'] as const;
type SeriesType = typeof seriesTypes[number];
const seriesTypeMap: Record<SeriesType, string> = {
  candlestick: 'ローソク足',
  line: 'ライン',
};

type FinanceRecord = StockPrice & {
  indicator: {
    sma1d: number;
    sma5w: number;
    sma13w: number;
    sma26w: number;
  };
};

type FinanceSource = {
  stockIssueCode: StockIssueCode;
  items: FinanceRecord[];
};

type MarkerPopover = {
  stockIssue: StockIssue;
  newsItem: NewsItem;
};

// HACK: リファクタする

type GraphEditorTopToolbarProps = {
  stockIssue: StockIssue;
  selectedIndicators: TechnicalIndicatorType[];
  onChangeSelectedIndicators: (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  selectedCompares: string[];
  onChangeCompares: (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
};

type GraphEditorProps = {
  loading: boolean;
  primarySource: FinanceSource | undefined;
  comparesSource: FinanceSource[];
  newsItemSource: NewsItem[];
};

type NewsTableProps = {
  values: NewsItem[];
  onClickAddEvent: React.MouseEventHandler<HTMLButtonElement>;
  onClickGroupEventLink?: (
    event: React.MouseEvent<HTMLElement>,
    groupEventId: string
  ) => void;
};

type TemplateProps = {
  graphEditorTopToolbarProps: GraphEditorTopToolbarProps;
  graphEditorProps: GraphEditorProps;
  newsTableProps: NewsTableProps;
};

const Template = ({
  graphEditorTopToolbarProps,
  graphEditorProps,
  newsTableProps,
}: TemplateProps) => {
  const { stockIssue, selectedCompares, selectedIndicators } =
    graphEditorTopToolbarProps;

  const [zoomPeriod, setZoomPeriod] = useState(() => ({
    start: defaultZoomEndDate,
    end: defaultZoomEndDate,
  }));

  const seriesTypeMenuRef = useRef(null);
  const [openSeriesTypeMenu, toggleOpenSeriesTypeMenu] = useToggle(false);

  const indicatorMenuRef = useRef(null);
  const [openIndicatorMenu, toggleOpenIndicatorMenu] = useToggle(false);

  const compareMenuRef = useRef(null);
  const [openCompareMenu, toggleOpenCompareMenu] = useToggle(false);

  const [showNewsMarker, toggleShowNewsMarker] = useToggle(true);
  const [seriesType, setSeriesType] = useState<SeriesType>('candlestick');

  useLayoutEffect(() => {
    if (graphEditorProps.comparesSource.length >= 1) {
      setSeriesType('line');
    }
  }, [graphEditorProps.comparesSource.length]);

  const [showMarkerPopover, setShowMarkerPopover] = useToggle(false);
  const [markerPopoverValue, setMarkerPopoverValue] = useState<MarkerPopover>();
  const markerPointPosRef = useRef({ x: 0, y: 0 });

  const visibility = useMemo(() => {
    const entries = technicalIndicatorTypes.map<
      [TechnicalIndicatorType, boolean]
    >((key) => [key, selectedIndicators.some((v) => v === key)]);
    return Object.fromEntries(entries);
  }, [selectedIndicators]);
  const showTurnover = selectedIndicators.some((v) => v === 'turnover');

  const { primarySource, comparesSource } = graphEditorProps;
  const financeSource = useMemo(() => {
    if (!primarySource) return [];
    return [primarySource, ...comparesSource];
  }, [comparesSource, primarySource]);
  const isCompareMode = graphEditorProps.comparesSource.length > 0;

  const xAxisValues = useMemo(
    () => primarySource?.items?.map((v) => v.date),
    [primarySource?.items]
  );

  const barSource = useMemo(
    () =>
      primarySource?.items?.reduce<{
        stockVolume: [DateString, number][];
        stockTurnover: [DateString, number][];
      }>(
        (result, v) => {
          result.stockTurnover.push([dayjs(v.date).format('L'), v.turnover]);
          result.stockVolume.push([dayjs(v.date).format('L'), v.volume]);
          return result;
        },
        { stockVolume: [], stockTurnover: [] }
      ),
    [primarySource?.items]
  );

  const dataset = useMemo(
    () =>
      financeSource.map(({ items, stockIssueCode }) => {
        if (!isCompareMode) {
          return {
            id: stockIssueCode,
            source: items.map((v) => ({
              date: toDateString(v.date),
              open: v.open,
              close: v.close,
              high: v.high,
              low: v.low,
              volume: v.volume,
              turnover: v.turnover,
              sma1d: v.indicator.sma1d,
              sma5w: v.indicator.sma5w,
              sma13w: v.indicator.sma13w,
              sma26w: v.indicator.sma26w,
            })),
          };
        }

        const { stockPrice, sma1d, sma5w, sma13w, sma26w } = items.reduce<{
          stockPrice: number[];
          sma1d: number[];
          sma5w: number[];
          sma13w: number[];
          sma26w: number[];
        }>(
          (result, v) => {
            result.stockPrice.push(v.close);
            result.sma1d.push(v.indicator.sma1d);
            result.sma5w.push(v.indicator.sma5w);
            result.sma13w.push(v.indicator.sma13w);
            result.sma26w.push(v.indicator.sma26w);
            return result;
          },
          { stockPrice: [], sma1d: [], sma5w: [], sma13w: [], sma26w: [] }
        );

        const calcRoc = (values: number[]) =>
          ROC.calculate({
            period: 1,
            values,
            format: (data) => round(data, 2),
          });

        const stockPriceRoc = [0, ...calcRoc(stockPrice)];

        const stockPricePercent = stockPriceRoc.reduce<number[]>(
          (prev, v, i) => {
            prev.push(Decimal.add(prev[i - 1] || 0, v).toNumber());
            return prev;
          },
          []
        );

        const sma1dRoc = [0, ...calcRoc(sma1d)];
        const sma5wRoc = [0, ...calcRoc(sma5w)];
        const sma13wRoc = [0, ...calcRoc(sma13w)];
        const sma26wRoc = [0, ...calcRoc(sma26w)];

        let offsetTargetIndex = items.findIndex((v) =>
          dayjs(v.date).isSame(zoomPeriod.start, 'd')
        );

        offsetTargetIndex = offsetTargetIndex < 0 ? 0 : offsetTargetIndex;

        return {
          id: stockIssueCode,
          source: items.map((v, i) => ({
            date: toDateString(v.date),
            open: 0,
            close: Decimal.sub(
              stockPricePercent[i],
              stockPricePercent[offsetTargetIndex]
            ).toNumber(),
            high: 0,
            low: 0,
            volume: v.volume,
            turnover: v.turnover,
            sma1d: sma1dRoc[i] - sma1dRoc[offsetTargetIndex],
            sma5w: sma5wRoc[i] - sma5wRoc[offsetTargetIndex],
            sma13w: sma13wRoc[i] - sma13wRoc[offsetTargetIndex],
            sma26w: sma26wRoc[i] - sma26wRoc[offsetTargetIndex],
          })),
        };
      }),
    [financeSource, isCompareMode, zoomPeriod.start]
  );

  const barGraph = useMemo<SeriesOption[]>(() => {
    if (!barSource || !primarySource) return [];

    let source;
    if (showTurnover) {
      source = {
        name: '売買代金',
        datasetId: primarySource.stockIssueCode,
        encode: {
          x: 'date',
          y: 'turnover',
        },
      };
    } else {
      source = {
        name: '出来高',
        datasetId: primarySource.stockIssueCode,
        encode: {
          x: 'date',
          y: 'volume',
        },
      };
    }

    return [
      {
        id: `${primarySource.stockIssueCode}-bar`,
        type: 'bar',
        yAxisId: 'static',
        color: '#49d5e2',
        dimensions: ['date', 'volume', 'turnover'],
        ...source,
      },
    ];
  }, [barSource, primarySource, showTurnover]);

  const newsItemsWithinZoom = useMemo(
    () =>
      graphEditorProps.newsItemSource.filter(
        (v) =>
          dayjs(v.timestamp).isSameOrAfter(zoomPeriod.start, 'd') &&
          dayjs(v.timestamp).isSameOrBefore(zoomPeriod.end, 'd')
      ),
    [graphEditorProps.newsItemSource, zoomPeriod.end, zoomPeriod.start]
  );

  const newsMarker = useMemo(() => {
    const source = dataset.at(0)?.source;
    if (!source) return [];

    const topItems = newsItemsWithinZoom
      .sort((a, b) =>
        Decimal.sub(b.status.volumeImpact, a.status.volumeImpact).toNumber()
      )
      .slice(0, 30);

    return topItems.flatMap((v) => {
      const yAxis = source.find(
        (record) => record.date === dayjs(v.timestamp).format('L')
      );
      if (!yAxis) return [];

      return [
        {
          ...getMarkerStyle(v.category.value),
          id: v.id,
          name: v.id,
          coord: [dayjs(v.timestamp).format('L'), yAxis.close],
        },
      ];
    });
  }, [dataset, newsItemsWithinZoom]);

  const seriesGroup = useMemo(
    () =>
      dataset.flatMap(({ id }) => {
        const series: SeriesOption[] = [];

        let stockSeriesBase;
        if (seriesType === 'line') {
          stockSeriesBase = {
            dimensions: ['date', 'close'],
            encode: {
              x: 'date',
              y: 'close',
              tooltip: 'close',
            },
          };
        } else {
          stockSeriesBase = {
            dimensions: ['date', 'open', 'close', 'high', 'low'],
            encode: {
              x: 'date',
              y: ['open', 'close', 'high', 'low'],
              tooltip: ['open', 'close', 'high', 'low'],
            },
          };
        }

        series.push({
          ...stockSeriesBase,
          id: `${id}-primary`,
          type: seriesType,
          name: `(${id}) 終値`,
          yAxisId: 'dynamic',
          itemStyle: seriesType === 'candlestick' ? candlestickStyle : {},
          datasetId: id,
          showSymbol: false,
          markPoint: {
            symbol: showNewsMarker ? 'pin' : 'none',
            symbolSize: 40,
            data: newsMarker,
            itemStyle: {
              // borderColor: getAvatarColor(stockIssue.name),
              // borderWidth: 1,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 3,
            },
          },
        });

        series.push({
          id: `${id}-sma1d`,
          type: 'line',
          name: visibility.sma1d ? `(${id}) 移動平均（日）` : '',
          yAxisId: 'dynamic',
          datasetId: id,
          dimensions: visibility.sma1d ? ['date', 'sma1d'] : [],
          encode: {
            x: 'date',
            y: 'sma1d',
          },
          showSymbol: false,
        });

        series.push({
          id: `${id}-sma5w`,
          type: 'line',
          name: visibility.sma5w ? `(${id}) 移動平均（5週）` : '',
          yAxisId: 'dynamic',
          datasetId: id,
          dimensions: visibility.sma5w ? ['date', 'sma5w'] : [],
          encode: {
            x: 'date',
            y: 'sma5w',
          },
          showSymbol: false,
        });

        series.push({
          id: `${id}-sma13w`,
          type: 'line',
          name: visibility.sma13w ? `(${id}) 移動平均（13週）` : '',
          yAxisId: 'dynamic',
          datasetId: id,
          dimensions: visibility.sma13w ? ['date', 'sma13w'] : [],
          encode: {
            x: 'date',
            y: 'sma13w',
          },
          showSymbol: false,
        });

        series.push({
          id: `${id}-sma26w`,
          type: 'line',

          name: visibility.sma26w ? `(${id}) 移動平均（26週）` : '',
          yAxisId: 'dynamic',
          datasetId: id,
          dimensions: visibility.sma26w ? ['date', 'sma26w'] : [],
          encode: {
            x: 'date',
            y: 'sma26w',
          },
          showSymbol: false,
        });

        return series;
      }),
    [
      dataset,
      newsMarker,
      seriesType,
      showNewsMarker,
      visibility.sma13w,
      visibility.sma1d,
      visibility.sma26w,
      visibility.sma5w,
    ]
  );

  const series = useMemo(
    () => [...barGraph, ...seriesGroup],
    [barGraph, seriesGroup]
  );

  const markerPopperRef = useRef<Instance>(null);

  const handleMarkerOver: StockGraphEditorProps['onMouseOver'] = (params) => {
    if (params.componentType === 'markPoint') {
      const newsItem = graphEditorProps.newsItemSource.find(
        (v) => v.id === params.data.id
      );

      if (!newsItem) return;

      const { clientX: x, clientY: y } = params.event.event;

      setMarkerPopoverValue({ newsItem, stockIssue });
      markerPointPosRef.current = { x, y };
      setShowMarkerPopover(true);
    }
  };

  return (
    <Stack
      sx={{
        flexGrow: 1,
        flexShrink: 1,
        minWidth: 0,
      }}
    >
      <Box>
        <Typography pt={2} pl={2} variant="h6" component="h1">
          自社分析
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={0.5} p={1}>
        <AsyncPresenter loading={graphEditorProps.loading}>
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
            <Button
              ref={seriesTypeMenuRef}
              name="seriesType"
              startIcon={
                seriesType === 'line' ? (
                  <ShowChartIcon />
                ) : (
                  <CandlestickChartOutlinedIcon />
                )
              }
              endIcon={<KeyboardArrowDownIcon />}
              onClick={() => toggleOpenSeriesTypeMenu(true)}
            >
              {seriesTypeMap[seriesType]}
            </Button>
            <Button
              ref={indicatorMenuRef}
              name="indicator"
              endIcon={<KeyboardArrowDownIcon />}
              onClick={() => toggleOpenIndicatorMenu()}
            >
              テクニカル・指標
            </Button>
            <Button
              ref={compareMenuRef}
              name="compare"
              endIcon={<KeyboardArrowDownIcon />}
              onClick={() => toggleOpenCompareMenu()}
            >
              指数比較
            </Button>
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
                  showNewsMarker ? (
                    <VisibilityOutlinedIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )
                }
                disableElevation
                onClick={() => toggleShowNewsMarker()}
              >
                ニュース表示
              </Button>
            </HtmlTooltip>
          </Paper>

          <StockGraphEditor
            dataset={dataset}
            xAxis={{ values: xAxisValues }}
            series={series}
            onZoom={setZoomPeriod}
            onMouseOver={handleMarkerOver}
          />

          <Paper variant="outlined">
            <NewsItemTable
              values={newsItemsWithinZoom}
              onClickAddEvent={newsTableProps.onClickAddEvent}
              onClickGroupEventLink={newsTableProps.onClickGroupEventLink}
            />
          </Paper>
        </AsyncPresenter>
      </Box>
      <Menu
        open={openSeriesTypeMenu}
        anchorEl={seriesTypeMenuRef.current}
        onClose={() => toggleOpenSeriesTypeMenu(false)}
      >
        <MenuItem onClick={() => setSeriesType('candlestick')}>
          <ListItemIcon>
            <CandlestickChartOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>ローソク足</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setSeriesType('line')}>
          <ListItemIcon>
            <ShowChartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>ライン</ListItemText>
        </MenuItem>
      </Menu>
      <MultiSelectMenu
        open={openIndicatorMenu}
        anchorEl={indicatorMenuRef.current}
        entries={Object.entries(seriesTypeMap).map(([k, v]) => ({
          label: v,
          value: k,
        }))}
        selectedValues={selectedIndicators}
        onClose={() => toggleOpenIndicatorMenu(false)}
        onChange={graphEditorTopToolbarProps.onChangeSelectedIndicators}
      />
      <MultiSelectMenu
        open={openIndicatorMenu}
        anchorEl={indicatorMenuRef.current}
        entries={[
          {
            label: '売買代金',
            value: 'turnover',
          },
          {
            label: '移動平均線（日）',
            value: 'sma1d',
          },
          {
            label: '移動平均線（5週）',
            value: 'sma5w',
          },
          {
            label: '移動平均線（13週）',
            value: 'sma13w',
          },
          {
            label: '移動平均線（26週）',
            value: 'sma26w',
          },
        ]}
        selectedValues={selectedIndicators}
        onClose={() => toggleOpenIndicatorMenu(false)}
        onChange={graphEditorTopToolbarProps.onChangeSelectedIndicators}
      />
      <MultiSelectMenu
        open={openCompareMenu}
        anchorEl={compareMenuRef.current}
        entries={[
          {
            label: '日経平均',
            value: '7832', // TODO 適切な銘柄コードを設定する
          },
          {
            label: 'TOPIX',
            value: '4392', // TODO 適切な銘柄コードを設定する
          },
          {
            label: 'マザーズ指数',
            value: '2388', // TODO 適切な銘柄コードを設定する
          },
        ]}
        selectedValues={selectedCompares}
        onClose={() => toggleOpenCompareMenu(false)}
        onChange={graphEditorTopToolbarProps.onChangeCompares}
      />
      <HtmlTooltip
        open={showMarkerPopover}
        title={
          markerPopoverValue ? (
            <Card
              sx={{
                width: 320,
                '& .MuiCardHeader-title': {
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  my: 1,
                },
                '& .MuiCardHeader-content': {
                  minWidth: 0,
                },
                '& .MuiCardContent-root': {},
              }}
              // onMouseEnter={() => setShowMarkerPopover(true)}
              // onMouseLeave={() => setShowMarkerPopover(false)}
            >
              <CardHeader
                title={
                  markerPopoverValue.newsItem.sourceRef ? (
                    <Link
                      target="_blank"
                      href={new URL(markerPopoverValue.newsItem.sourceRef)}
                      underline="hover"
                    >
                      {markerPopoverValue.newsItem.description}
                    </Link>
                  ) : (
                    markerPopoverValue.newsItem.description
                  )
                }
                subheader={
                  <Row>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        pr: 1,
                      }}
                    >
                      <Avatar
                        sx={{ width: 28, height: 28, fontSize: 9 }}
                        label={markerPopoverValue.stockIssue.name}
                      />
                    </Box>
                    <Stack sx={{ flex: '1 1 auto', maxWidth: 1 }}>
                      {/* <Tooltip title={markerPopoverValue.stockIssue.name}> */}
                      <Typography
                        fontSize="13px"
                        sx={{
                          flexGrow: 1,
                          // overflow: 'hidden',
                          // textOverflow: 'ellipsis',
                          // whiteSpace: 'nowrap',
                        }}
                      >
                        {`(${
                          markerPopoverValue.stockIssue.code
                        }) ${removeLegalType(
                          markerPopoverValue.stockIssue.name
                        )}`}
                      </Typography>
                      {/* </Tooltip> */}
                      <div>
                        <Typography fontSize="13px">
                          {toDateString(
                            markerPopoverValue.newsItem.timestamp,
                            'L LT'
                          )}
                        </Typography>
                      </div>
                    </Stack>
                  </Row>
                }
              />
              <CardContent sx={{ py: 0, fontSize: '14px' }}>
                <Box>
                  <Row sx={{ justifyContent: 'space-between' }}>
                    出来高インパクト
                    <Typography component="span" fontWeight="bold">
                      {round(
                        Decimal.mul(
                          markerPopoverValue.newsItem.status.volumeImpact,
                          100
                        ).toNumber(),
                        1
                      )}
                      %
                    </Typography>
                  </Row>
                  <Row sx={{ justifyContent: 'space-between' }}>
                    株価インパクト
                    <Typography component="span" fontWeight="bold">
                      {round(
                        Decimal.mul(
                          markerPopoverValue.newsItem.status.stockImpact,
                          100
                        ).toNumber(),
                        1
                      )}
                      %
                    </Typography>
                  </Row>
                  <Row sx={{ justifyContent: 'space-between' }}>
                    株価変動（翌営業日後）
                    <Typography component="span" fontWeight="bold">
                      {round(
                        Decimal.mul(
                          markerPopoverValue.newsItem.status.roc1d,
                          100
                        ).toNumber(),
                        1
                      )}
                      %
                    </Typography>
                  </Row>
                  <Row sx={{ justifyContent: 'space-between' }}>
                    株価変動（5営業日後）
                    <Typography component="span" fontWeight="bold">
                      {round(
                        Decimal.mul(
                          markerPopoverValue.newsItem.status.roc5d,
                          100
                        ).toNumber(),
                        1
                      )}
                      %
                    </Typography>
                  </Row>
                </Box>
              </CardContent>
              <CardActions>
                {!!markerPopoverValue.newsItem.sourceRef && (
                  <Button
                    sx={{
                      ml: 'auto',
                    }}
                    size="small"
                    href={markerPopoverValue.newsItem.sourceRef}
                    target="_blank"
                    endIcon={<OpenInNewIcon />}
                  >
                    記事を表示
                  </Button>
                )}
              </CardActions>
            </Card>
          ) : null
        }
        PopperProps={{
          popperRef: markerPopperRef,
          anchorEl: {
            getBoundingClientRect: () =>
              new DOMRect(
                markerPointPosRef.current.x,
                markerPointPosRef.current.y,
                0,
                0
              ),
          },
        }}
        sx={{
          [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'transparent',
            border: 'none',
          },
        }}
        onClose={() => setShowMarkerPopover(false)}
      >
        <Box sx={{ width: 0, height: 0 }} />
      </HtmlTooltip>
    </Stack>
  );
};

export default Template;

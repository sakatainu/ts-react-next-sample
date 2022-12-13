import {
  AddCircleOutlineRounded as AddCircleOutlineRoundedIcon,
  Create as CreateIcon,
  Delete as DeleteIcon,
  DoneRounded as DoneRoundedIcon,
  MoreVert as MoreVertIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  TextField,
  tooltipClasses,
  Typography,
} from '@mui/material';
import { Instance } from '@popperjs/core';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import { SeriesOption } from 'echarts';
import { round } from 'mathjs';
import { useModal } from 'mui-modal-provider';
import { useSnackbar } from 'notistack';
import React, { useMemo, useRef, useState } from 'react';
import { useToggle } from 'react-use';
import AsyncPresenter from '~/components/ui/AsyncPresenter';
import Avatar from '~/components/ui/Avatar';
import ConfirmDialog from '~/components/ui/ConfirmDialog';
import HtmlTooltip from '~/components/ui/HtmlTooltip';
import Link from '~/components/ui/Link';
import NewsItemTable from '~/components/ui/NewsItemTable';
import Row from '~/components/ui/Row';
import SaveDialog from '~/components/ui/SaveDialog';
import SaveMenuButton from '~/components/ui/SaveMenuButton';
import Selector, { SelectorProps } from '~/components/ui/Selector';
import StockGraphEditor, {
  StockGraphEditorProps,
} from '~/components/ui/StockGraphEditor';
import StockIssueSearchDialog from '~/components/ui/StockIssueSearchDialog';
import { CategoryType, NewsItem } from '~/hooks/useNewsItems';
import {
  GroupListedStockIssueId,
  GroupStockIssueListId,
} from '~/types/graphql';
import {
  calcParentLine,
  getAvatarColor,
  getFontColor,
  removeLegalType,
  toDateString,
} from '~/utils';
import GraphEditorTopToolbar, {
  GraphEditorTopToolbarProps,
} from './GraphEditorTopToolbar';
import {
  categoryMarkerPin,
  indicatorMap,
  IndicatorType,
  indicatorTypes,
  SourceType,
  technicalMap,
  TechnicalType,
  technicalTypes,
} from '../types';

const defaultEndDate = dayjs().toDate();
const defaultZoomEndDate = defaultEndDate;

type FinanceRecord = StockPrice & {
  indicator: {
    sma1d: number;
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

const getMarkerStyle = (category: CategoryType) => {
  const index = Object.fromEntries(categoryMarkerPin.map((v) => [v.type, v]));
  return {
    value: '',
    itemStyle: {
      color: index[category].markerColor,
    },
  };
};
// HACK: リファクタする

type GlobalProps = {
  stockIssues: StockIssue[];
};

type StockIssueSelectorProps = {
  values: {
    id?: GroupListedStockIssueId;
    stockIssue: StockIssue;
  }[];
  onSelectCompare: (
    event: React.MouseEvent<HTMLButtonElement>,
    value: StockIssue
  ) => void;
  onDeleteCompare: SelectorProps['onClickItemDelete'];
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

type TitleProps = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
};

export type TemplateProps = {
  id: GroupStockIssueListId | undefined;
  baseProps: GlobalProps;
  titleProps: TitleProps;
  graphEditorTopToolbarProps: GraphEditorTopToolbarProps;
  stockIssueSelectorProps: StockIssueSelectorProps;
  graphEditorProps: GraphEditorProps;
  newsTableProps: NewsTableProps;
  onSave: () => Promise<void>;
  onSaveAs: (name: string) => Promise<void>;
  onDelete: () => void;
};

const Template = ({
  id,
  titleProps,
  baseProps,
  graphEditorTopToolbarProps,
  graphEditorProps,
  stockIssueSelectorProps,
  newsTableProps,
  onSave,
  onSaveAs,
  onDelete,
}: TemplateProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { showModal } = useModal();

  const {
    value: {
      stockIssue,
      selectedIndicator,
      selectedTechnicals,
      showNewsMarker,
    },
  } = graphEditorTopToolbarProps;

  const [zoomPeriod, setZoomPeriod] = useState(() => ({
    start: defaultZoomEndDate,
    end: defaultZoomEndDate,
  }));

  const [openStockIssueSearchDialog, setOpenStockIssueSearchDialog] =
    useToggle(false);
  const [openSaveDialog, setOpenSaveAsDialog] = useToggle(false);

  const [showMarkerPopover, setShowMarkerPopover] = useToggle(false);
  const [markerPopoverValue, setMarkerPopoverValue] = useState<MarkerPopover>();
  const markerPointPosRef = useRef({ x: 0, y: 0 });

  const editorMenuRef = useRef<HTMLButtonElement>(null);
  const [openEditorMenu, setOenEditorMenu] = useToggle(false);

  const { primarySource, comparesSource } = graphEditorProps;
  const financeSource = useMemo(() => {
    if (!primarySource) return [];
    return [primarySource, ...comparesSource];
  }, [comparesSource, primarySource]);

  const xAxisValues = useMemo(
    () => primarySource?.items?.map((v) => v.date),
    [primarySource?.items]
  );

  const dataset = useMemo(
    () =>
      financeSource.map(({ items, stockIssueCode }) => {
        const map = items.reduce<Record<SourceType, number[]>>(
          (result, v) => {
            result.close.push(v.close);
            result.volume.push(v.volume);
            result.turnover.push(v.turnover);
            result.sma1d.push(v.indicator.sma1d);
            return result;
          },
          {
            close: [],
            volume: [],
            turnover: [],
            sma1d: [],
          }
        );

        let startIndex = items.findIndex((v) =>
          dayjs(v.date).isSame(zoomPeriod.start, 'd')
        );
        startIndex = startIndex < 0 ? 0 : startIndex;

        const dummy = Array.from(new Array<number>(startIndex), () => 0);
        const indicatorSource = indicatorTypes.flatMap<
          [IndicatorType, number[]]
        >((v) => {
          if (selectedIndicator !== v) return [];
          return [[v, dummy.concat(calcParentLine(map[v].slice(startIndex)))]];
        });
        const indicatorSourceMap = Object.fromEntries(indicatorSource);
        const technicalSource = technicalTypes.flatMap<
          [TechnicalType, number[]]
        >((v) => {
          if (!selectedTechnicals.includes(v)) return [];
          return [[v, dummy.concat(calcParentLine(map[v].slice(startIndex)))]];
        });
        const technicalSourceMap = Object.fromEntries(technicalSource);

        return {
          id: stockIssueCode,
          source: items.map((v, i) => ({
            date: toDateString(v.date),
            ...(indicatorSourceMap.close && {
              close: indicatorSourceMap.close[i],
            }),
            ...(indicatorSourceMap.volume && {
              volume: indicatorSourceMap.volume[i],
            }),
            ...(indicatorSourceMap.turnover && {
              turnover: indicatorSourceMap.turnover[i],
            }),
            ...(technicalSourceMap.sma1d && {
              sma1d: technicalSourceMap.sma1d[i],
            }),
          })),
        };
      }),
    [financeSource, selectedIndicator, selectedTechnicals, zoomPeriod.start]
  );

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
          coord: [dayjs(v.timestamp).format('L'), yAxis[selectedIndicator]],
        },
      ];
    });
  }, [dataset, newsItemsWithinZoom, selectedIndicator]);

  const seriesOption = useMemo(
    () =>
      dataset.flatMap(({ id: $id }) => {
        const series: SeriesOption[] = [];

        series.push({
          id: `${$id}-primary`,
          type: 'line',
          name: `(${$id}) ${indicatorMap[selectedIndicator]}`,
          yAxisId: 'dynamic',
          datasetId: $id,
          dimensions: ['date', selectedIndicator],
          showSymbol: false,
          encode: {
            x: 'date',
            y: selectedIndicator,
            tooltip: selectedIndicator,
          },
          markPoint: {
            symbol: showNewsMarker ? 'pin' : 'none',
            symbolSize: 40,
            data: newsMarker,
            itemStyle: {
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 3,
            },
          },
        });

        technicalTypes.forEach((type) => {
          const visible = selectedTechnicals.includes(type);
          series.push({
            id: `${$id}-${type}`,
            type: 'line',
            name: visible ? `(${$id}) ${technicalMap[type]}` : '',
            yAxisId: 'dynamic',
            datasetId: $id,
            dimensions: visible ? ['date', type] : [],
            encode: { x: 'date', y: type },
            showSymbol: false,
          });
        });

        return series;
      }),
    [dataset, newsMarker, selectedIndicator, selectedTechnicals, showNewsMarker]
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

  const handleClickOpenSelectComparesDialog = () => {
    setOpenStockIssueSearchDialog(true);
  };

  const handleClickSelectCompares =
    (v: StockIssue): React.MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      stockIssueSelectorProps.onSelectCompare(e, v);
      setOpenStockIssueSearchDialog(false);
    };

  const handleClickSaveAs = () => {
    if (!stockIssueSelectorProps.values.length) {
      enqueueSnackbar('比較銘柄は1件以上選択する必要があります。', {
        variant: 'error',
      });
      return;
    }

    setOpenSaveAsDialog(true);
  };

  const handleClickSave = () => {
    (async () => {
      if (!id) {
        await onSaveAs(titleProps.value);
      } else {
        await onSave();
      }
    })();
  };

  const handleSubmitSaveAs: React.FormEventHandler = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const saveName = formData.get('saveName')?.toString();

    if (!saveName) return;

    (async () => {
      await onSaveAs(saveName);
    })();
  };

  const handleDelete = () => {
    const modal = showModal(ConfirmDialog, {
      title: 'ウォッチリストの削除',
      message: '現在のウォッチリストを削除します。よろしいですか？',
      actions: [
        <Button key="1" onClick={() => modal.destroy()} autoFocus>
          キャンセル
        </Button>,
        <Button key="2" onClick={onDelete} variant="contained" color="error">
          削除
        </Button>,
      ],
    });
  };

  return (
    <Box>
      <Row
        p={1}
        px={2}
        sx={{
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <TextField
            variant="outlined"
            value={titleProps.value}
            size="small"
            sx={{
              minWidth: 360,
            }}
            InputProps={{
              autoComplete: 'off',
              endAdornment: <CreateIcon />,
              sx: {
                fontSize: ({ typography }) => typography.h6,
                '& .MuiInputBase-input': {
                  pl: 0,
                },
                '&:not(.Mui-focused):not(:hover) .MuiOutlinedInput-notchedOutline':
                  {
                    borderWidth: 0,
                  },
              },
            }}
            onChange={titleProps.onChange}
            onBlur={titleProps.onBlur}
          />
        </Box>

        <Row
          sx={{
            gap: 1,
          }}
        >
          <SaveMenuButton
            onClickSave={handleClickSave}
            onClickSaveAs={handleClickSaveAs}
          />
          <IconButton
            ref={editorMenuRef}
            sx={{
              display: id ? 'flex' : 'none',
            }}
            onClick={() => setOenEditorMenu(true)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={editorMenuRef.current}
            open={openEditorMenu}
            onClose={() => setOenEditorMenu(false)}
          >
            <MenuList disablePadding>
              <MenuItem onClick={handleDelete}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText color="error">ウォッチリストを削除</ListItemText>
              </MenuItem>
            </MenuList>
          </Menu>
        </Row>
      </Row>
      <Divider variant="middle" />
      <Row sx={{ flexGrow: 1, alignItems: 'center', minHeight: 48, px: 2 }}>
        <Typography
          variant="caption"
          mr={1}
          sx={{
            lineHeight: ({ typography }) => typography.caption.fontSize,
          }}
        >
          比較:
        </Typography>
        <Selector
          placeholder={
            <Button onClick={handleClickOpenSelectComparesDialog}>
              銘柄を選択
            </Button>
          }
          value={stockIssueSelectorProps.values.map(({ stockIssue: v }) => ({
            id: v.code,
            label: `(${v.code}) ${removeLegalType(v.name)}`,
            tooltip: v.name,
            avatar: <Avatar label={v.name} />,
            sx: {
              maxWidth: 180,
              backgroundColor: ({ palette }) => palette.background.default,
              '& .MuiChip-avatar': {
                color: getFontColor(getAvatarColor(v.name)),
                fontSize: '9px',
              },
            },
          }))}
          onClickAdd={handleClickOpenSelectComparesDialog}
          onClickItemDelete={stockIssueSelectorProps.onDeleteCompare}
        />
      </Row>

      <Box display="flex" flexDirection="column" gap={0.5} px={1}>
        <AsyncPresenter loading={graphEditorProps.loading}>
          <GraphEditorTopToolbar {...graphEditorTopToolbarProps} />

          <StockGraphEditor
            dataset={dataset}
            xAxis={{ values: xAxisValues }}
            series={seriesOption}
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
      <StockIssueSearchDialog
        key={`StockIssueSearchDialog-${String(openStockIssueSearchDialog)}`}
        open={openStockIssueSearchDialog}
        searchSource={baseProps.stockIssues}
        onClose={() => setOpenStockIssueSearchDialog(false)}
      >
        {(v) =>
          v.map((item) => (
            <Row
              key={item.code}
              sx={{
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Avatar
                sx={{ width: 32, height: 32, fontSize: 9 }}
                label={item.name}
              />
              <Box flexGrow={1}>
                <Typography variant="body2" component="h1">
                  {item.code}
                </Typography>
                <Typography variant="body1" fontWeight="bold" component="h2">
                  {item.name}
                </Typography>
              </Box>
              {stockIssueSelectorProps.values.some(
                (selected) => item.code === selected.stockIssue.code
              ) ? (
                <IconButton disabled>
                  <DoneRoundedIcon color="success" />
                </IconButton>
              ) : (
                <IconButton onClick={handleClickSelectCompares(item)}>
                  <AddCircleOutlineRoundedIcon />
                </IconButton>
              )}
            </Row>
          ))
        }
      </StockIssueSearchDialog>
      <SaveDialog
        key={`SaveDialog-${String(openSaveDialog)}`}
        open={openSaveDialog}
        initialState={{
          title: '新規ウォッチリスト',
        }}
        onClose={() => setOpenSaveAsDialog(false)}
        onSubmit={handleSubmitSaveAs}
      />
    </Box>
  );
};

export default Template;

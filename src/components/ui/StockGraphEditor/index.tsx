import { Box, Button, InputBase, Paper } from '@mui/material';
import dayjs from 'dayjs';
import EChartsReact from 'echarts-for-react';
import React, { MutableRefObject, useMemo, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';
import Row from '~/components/ui/Row';
import StockGraph, { StockGraphProps } from '~/components/ui/StockGraph';
import { toDateString } from '~/utils';

const zoomPresetKeys = ['1M', '3M', '6M', '1Y', 'all'] as const;
type ZoomPresetKey = typeof zoomPresetKeys[number];
const zoomPreset: Record<
  ZoomPresetKey,
  {
    key: ZoomPresetKey;
    label: string;
    days: number;
  }
> = {
  '1M': {
    key: '1M',
    label: '1カ月',
    days: 30,
  },
  '3M': {
    key: '3M',
    label: '3カ月',
    days: 90,
  },
  '6M': {
    label: '6カ月',
    key: '6M',
    days: 182,
  },
  '1Y': {
    label: '1年',
    key: '1Y',
    days: 364,
  },
  all: {
    label: 'すべて',
    key: 'all',
    days: 0,
  },
} as const;

const defaultEndDate = dayjs().toDate();
const defaultStartDate = defaultEndDate;

export type StockGraphEditorProps = StockGraphProps & {
  graphRef?: MutableRefObject<EChartsReact | null> | null;
};
const StockGraphEditor = ({
  graphRef: ownerGraphRef = null,
  dataset,
  xAxis,
  series = [],
  onChartReady,
  onZoom,
  onMouseOver,
}: StockGraphEditorProps) => {
  const graphRef = useRef<EChartsReact>(null);
  const graphInstance = graphRef.current?.getEchartsInstance();

  const xAxisDates = xAxis?.values ?? [defaultStartDate, defaultEndDate];
  const xAxisStartDate = xAxisDates.at(0);
  const xAxisEndDate = xAxisDates.at(-1);

  const [zoomPeriod, setZoomPeriod] = useState<
    Partial<Period> & { startInput: string; endInput: string }
  >(() => ({
    start: xAxisStartDate,
    startInput: xAxisStartDate ? toDateString(xAxisStartDate) : '',
    end: xAxisEndDate,
    endInput: xAxisEndDate ? toDateString(xAxisEndDate) : '',
  }));

  const graphLines = useMemo(() => series.map((v) => v), [series]);

  const handleOnZoom: StockGraphProps['onZoom'] = (
    zoomValue,
    $graphInstance
  ) => {
    setZoomPeriod({
      ...zoomValue,
      startInput: toDateString(zoomValue.start),
      endInput: toDateString(zoomValue.end),
    });
    onZoom?.(zoomValue, $graphInstance);
  };

  const handleClickZoomPreset: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    if (!graphInstance) return;

    const zoomPresetItem = zoomPreset[e.currentTarget.value as ZoomPresetKey];

    let startDateIndex;
    let endDateIndex;
    if (zoomPresetItem.key === 'all') {
      startDateIndex = 0;
      endDateIndex = xAxisDates.length - 1;
    } else {
      const startIndex = xAxisDates.findIndex((v) =>
        dayjs(v).isSame(zoomPeriod.start, 'd')
      );
      const endIndex = xAxisDates.findIndex((v) =>
        dayjs(v).isSame(zoomPeriod.end, 'd')
      );
      const centerIndex = Math.round((startIndex + endIndex) / 2);

      startDateIndex = centerIndex - Math.round(zoomPresetItem.days / 2);
      endDateIndex = centerIndex + Math.round(zoomPresetItem.days / 2);
      if (startDateIndex < 0) {
        startDateIndex = 0;
        endDateIndex = startDateIndex + zoomPresetItem.days;
      } else if (endDateIndex > xAxisDates.length - 1) {
        endDateIndex = xAxisDates.length - 1;
        startDateIndex = endDateIndex - zoomPresetItem.days;
      }
    }
    const startDate = xAxisDates.at(startDateIndex);
    const endDate = xAxisDates.at(endDateIndex);

    if (!startDate || !endDate) return;

    graphInstance.dispatchAction({
      type: 'dataZoom',
      startValue: toDateString(startDate),
      endValue: toDateString(endDate),
    });
  };

  const handleChartReady: StockGraphProps['onChartReady'] = (chart) => {
    const startDate = xAxisDates.at(-31) || xAxisDates.at(0);
    const endDate = xAxisDates.at(-1) || xAxisDates.at(0);

    if (!startDate || !endDate) return;

    chart.dispatchAction({
      type: 'dataZoom',
      startValue: toDateString(startDate),
      endValue: toDateString(endDate),
    });

    onChartReady?.(chart);
  };

  const handleChangeZoomPeriodStart: React.ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    setZoomPeriod((prev) => ({ ...prev, startInput: e.target.value }));
  };

  const handleChangeZoomPeriodEnd: React.ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    setZoomPeriod((prev) => ({ ...prev, endInput: e.target.value }));
  };

  const changeZoomPeriod = (dateValue: string, type: 'start' | 'end') => {
    const date = dayjs(dateValue, 'YYYY/M/D');

    if (date.isValid() && xAxisDates.some((v) => date.isSame(v, 'date'))) {
      graphInstance?.dispatchAction({
        type: 'dataZoom',
        [`${type}Value`]: date.format('L'),
      });
    } else {
      setZoomPeriod((prev) => {
        const prevValue = prev[type];
        return {
          ...prev,
          [`${type}Input`]: prevValue ? toDateString(prevValue) : '',
        };
      });
    }
  };

  const handleBlurZoomPeriodStart: React.FocusEventHandler<HTMLInputElement> = (
    e
  ) => {
    changeZoomPeriod(e.target.value, 'start');
  };

  const handleKeyEnterZoomPeriodStart: React.KeyboardEventHandler<
    HTMLInputElement
  > = (e) => {
    if (e.key === 'Enter') {
      const targetValue = (e.nativeEvent.target as HTMLInputElement).value;
      changeZoomPeriod(targetValue, 'start');
    }
  };

  const handleBlurZoomPeriodEnd: React.FocusEventHandler<HTMLInputElement> = (
    e
  ) => {
    changeZoomPeriod(e.target.value, 'end');
  };

  const handleKeyEnterZoomPeriodEnd: React.KeyboardEventHandler<
    HTMLInputElement
  > = (e) => {
    if (e.key === 'Enter') {
      const targetValue = (e.nativeEvent.target as HTMLInputElement).value;
      changeZoomPeriod(targetValue, 'end');
    }
  };

  return (
    <>
      <Paper variant="outlined">
        <StockGraph
          ref={mergeRefs([ownerGraphRef, graphRef])}
          dataset={dataset}
          xAxis={xAxis}
          series={graphLines}
          onZoom={handleOnZoom}
          onChartReady={handleChartReady}
          onMouseOver={onMouseOver}
        />
      </Paper>
      <Box sx={{ display: 'flex', alignItems: 'center', height: 40 }}>
        <Row>
          <Paper
            variant="outlined"
            sx={{
              '& .MuiButton-root': {
                minWidth: 40,
              },
              '& .MuiButton-root, & .ZoomPeriod-root:not(:last-of-type)': {
                borderRight: '1px solid',
                borderRadius: 0,
                borderColor: (theme) => theme.palette.primary.light,
              },
              '& .ZoomPeriod-root': {
                width: 100,
                fontSize: 14,
                '& input': {
                  textAlign: 'center',
                },
              },
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
              }}
            >
              {zoomPresetKeys.map((v) => (
                <Button
                  key={zoomPreset[v].key}
                  size="small"
                  className="ZoomInput-root"
                  value={zoomPreset[v].key}
                  onClick={handleClickZoomPreset}
                >
                  {zoomPreset[v].label}
                </Button>
              ))}
            </Box>
            <InputBase
              name="zoomPeriodStart"
              className="ZoomPeriod-root"
              value={zoomPeriod.startInput}
              onChange={handleChangeZoomPeriodStart}
              onBlur={handleBlurZoomPeriodStart}
              onKeyDown={handleKeyEnterZoomPeriodStart}
            />
            <InputBase
              name="zoomPeriodEnd"
              className="ZoomPeriod-root"
              value={zoomPeriod.endInput}
              onChange={handleChangeZoomPeriodEnd}
              onBlur={handleBlurZoomPeriodEnd}
              onKeyDown={handleKeyEnterZoomPeriodEnd}
            />
          </Paper>
        </Row>
      </Box>
    </>
  );
};

export default StockGraphEditor;

import { Box } from '@mui/system';
import dayjs from 'dayjs';
import {
  ECharts,
  EChartsOption,
  MouseEventParams,
  SeriesOption,
} from 'echarts';
import EChartsReact from 'echarts-for-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useEffectRef from '~/hooks/useEffectRef';

type GraphPeriod = Period & {
  xAxisStartIndex: number;
  xAxisEndIndex: number;
};

export type StockGraphProps = {
  dataset?: EChartsOption['dataset'];
  xAxis?: {
    values?: Date[];
  };
  series?: SeriesOption[];
  onZoom?: (value: GraphPeriod, chartInstance: ECharts) => void;
  onChartReady?: (chartInstance: ECharts) => void;
  onMouseOver?: (params: MouseEventParams, chart: ECharts) => void;
};

const StockGraph = React.forwardRef<EChartsReact, StockGraphProps>(
  (
    { dataset, xAxis = {}, series = [], onZoom, onChartReady, onMouseOver },
    ref
  ) => {
    const paramRef = useEffectRef({
      onZoom,
      onChartReady,
      onMouseHover: onMouseOver,
    });

    // echarts は 新しい状態と古い状態をマージして差分を表示するため、新しい状態側でデータが減っても古い状態側にデータがあるとグラフ上にデータが残ってしまう。
    // これを回避するため、不要なシリーズはデータを空でマージさせてグラフ上から削除する
    const prevSeriesRef = useRef(series);
    const [fixedSeries, setFixedSeries] = useState(series);
    useEffect(() => {
      const prevSeries = [...prevSeriesRef.current];
      prevSeriesRef.current = series;

      if (!prevSeries.length) {
        setFixedSeries(series);
        return;
      }

      const removeSeries = prevSeries.flatMap<SeriesOption>((v) => {
        if (series.some((l) => l.id === v.id)) return [];

        return [
          {
            ...v,
            name: '',
            dimensions: [],
          },
        ];
      });

      setFixedSeries(series.concat(removeSeries));
    }, [series]);

    const xAxisDateLabels = useMemo(
      () => xAxis.values?.map((v) => dayjs(v).format('L')) ?? [],
      [xAxis.values]
    );

    const chartOptions = useMemo<EChartsOption>(
      () => ({
        dataset,
        legend: { top: 16 },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // animation: false,
            type: 'cross',
          },
        },
        xAxis: {
          type: 'category',
          data: xAxisDateLabels,
          scale: true,
          splitLine: { show: true },
          splitArea: {
            show: true,
          },
        },
        yAxis: [
          {
            id: 'dynamic',
            type: 'value',
            position: 'right',
            splitLine: { show: false },
            max: 'dataMax',
            min: 'dataMin',
            // axisLabel: {
            //   formatter: '{value} %',
            // },
          },
          {
            id: 'static',
            type: 'value',
            position: 'left',
            splitLine: {
              show: false,
            },
          },
        ],

        series: fixedSeries,
        dataZoom: [
          {
            type: 'slider',
          },
          {
            type: 'inside',
          },
        ],
      }),
      [dataset, fixedSeries, xAxisDateLabels]
    );

    const handleOnZoom = useCallback(
      (_: unknown, chart: ECharts) => {
        const chartOption = chart.getOption() as EChartsOption;
        const { dataZoom = [] } = chartOption;
        const xAxisOpt = Array.isArray(chartOption.xAxis)
          ? chartOption.xAxis[0]
          : chartOption.xAxis;
        if (!xAxisOpt) return;

        const { startValue, endValue } = Array.isArray(dataZoom)
          ? dataZoom[0] // is slider
          : dataZoom;

        if (typeof startValue === 'number' && typeof endValue === 'number') {
          const xAxisOptData = (xAxisOpt as { data: string[] }).data;
          const start = new Date(xAxisOptData[startValue]);
          const end = new Date(xAxisOptData[endValue]);

          paramRef.current.onZoom?.(
            {
              start,
              xAxisStartIndex: startValue,
              end,
              xAxisEndIndex: endValue,
            },
            chart
          );
        }
      },
      [paramRef]
    );

    const handleMouseOver = useCallback<
      NonNullable<StockGraphProps['onMouseOver']>
    >(
      (params, chart) => {
        paramRef.current.onMouseHover?.(params, chart);
      },
      [paramRef]
    );

    return (
      <Box
        sx={{
          width: 1,
          height: 1,
        }}
      >
        <EChartsReact
          ref={ref}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '600px',
          }}
          option={chartOptions}
          onEvents={{
            dataZoom: handleOnZoom,
            mouseover: handleMouseOver,
          }}
          onChartReady={paramRef.current.onChartReady}
        />
      </Box>
    );
  }
);
StockGraph.displayName = 'StockGraph';

export default StockGraph;

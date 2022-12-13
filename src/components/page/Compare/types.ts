import { CategoryType } from '~/hooks/useNewsItems';

export const indicatorTypes = ['close', 'volume', 'turnover'] as const;
export type IndicatorType = typeof indicatorTypes[number];
export const indicatorMap: Record<IndicatorType, string> = {
  close: '株価',
  volume: '出来高',
  turnover: '売買代金',
};

export const technicalTypes = ['sma1d'] as const;
export type TechnicalType = typeof technicalTypes[number];
export const technicalMap: Record<TechnicalType, string> = {
  sma1d: '移動平均（日）',
};

export const stockIndexTypes = ['ni225', 'topix', 'mothers'] as const;
export type StockIndexType = typeof stockIndexTypes[number];
export const stockIndexMap: Record<StockIndexType, string> = {
  ni225: '日経平均',
  topix: 'TOPIX',
  mothers: 'マザーズ指数',
};

export const sourceTypes = [
  'close',
  ...indicatorTypes,
  ...technicalTypes,
] as const;
export type SourceType = typeof sourceTypes[number];

export const categoryMarkerPin: {
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

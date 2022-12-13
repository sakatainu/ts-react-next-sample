import { SvgIcon, SvgIconProps } from '@mui/material';
import BellSvg from './svg/bell.svg';
import DocumentSearchSvg from './svg/document_search.svg';
import GraphSvg from './svg/graph.svg';
import GraphCompareSvg from './svg/graph_compare.svg';
import DataTableSvg from './svg/data_table.svg';

// TODO: svgがanyになってしまう。
// https://zenn.dev/catnose99/articles/49c12f84182bdf
// 上記参考にしてみたが駄目だった

export const Graph = (props: SvgIconProps) => (
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  <SvgIcon component={GraphSvg} inheritViewBox {...props} />
);

export const GraphCompare = (props: SvgIconProps) => (
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  <SvgIcon component={GraphCompareSvg} inheritViewBox {...props} />
);

export const DocumentSearch = (props: SvgIconProps) => (
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  <SvgIcon component={DocumentSearchSvg} inheritViewBox {...props} />
);

export const DataTable = (props: SvgIconProps) => (
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  <SvgIcon component={DataTableSvg} inheritViewBox {...props} />
);

export const Bell = (props: SvgIconProps) => (
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  <SvgIcon component={BellSvg} inheritViewBox {...props} />
);

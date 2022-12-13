import {
  EditRounded as EditRoundedIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  Link,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  tooltipClasses,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Instance } from '@popperjs/core';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import { round } from 'mathjs';
import React, { useCallback, useRef, useState } from 'react';
import { useToggle } from 'react-use';
import SearchKeywords from '~/components/ui/SearchKeywords';
import HtmlTooltip from '~/components/ui/HtmlTooltip';
import Row from '~/components/ui/Row';
import { NewsItem } from '~/hooks/useNewsItems';
import { numberCompare, Order } from '~/utils';

type OrderKey = keyof NewsItemRow | undefined;

type NewsItemRow = {
  timestamp: Date;
  category: string;
  type: string;
  description: string;
  roc1d: number;
  roc5d: number;
  stockImpact: number;
  volumeImpact: number;
};

type HeadCell = {
  id: keyof NewsItemRow;
  label: string;
  align?: TableCellProps['align'];
  comparator: (orderBy: Order) => (a: NewsItem, b: NewsItem) => number;
};

const headCells: readonly HeadCell[] = [
  {
    id: 'timestamp',
    label: '日時',
    comparator: (orderBy) => (a, b) =>
      (a.timestamp.getTime() - b.timestamp.getTime()) *
      (orderBy === 'desc' ? -1 : 1),
  },
  {
    id: 'category',
    label: '区分',
    comparator: (orderBy) => (a, b) =>
      a.category.value.localeCompare(b.category.value) *
      (orderBy === 'desc' ? -1 : 1),
  },
  {
    id: 'type',
    label: 'ニュース種別',
    comparator: (orderBy) => (a, b) =>
      a.type.value.localeCompare(b.type.value) * (orderBy === 'desc' ? -1 : 1),
  },
  {
    id: 'description',
    label: 'タイトル／メモ',
    comparator: (orderBy) => (a, b) =>
      a.description.localeCompare(b.description) *
      (orderBy === 'desc' ? -1 : 1),
  },
  {
    id: 'roc1d',
    label: '株価変動 （翌営業日）',
    comparator: (orderBy) => (a, b) =>
      numberCompare(orderBy)(a.status.roc1d, b.status.roc1d),
  },
  {
    id: 'roc5d',
    label: '株価変動 （5営業日後）',
    comparator: (orderBy) => (a, b) =>
      numberCompare(orderBy)(a.status.roc5d, b.status.roc5d),
  },
  {
    id: 'stockImpact',
    label: '株価インパクト',
    comparator: (orderBy) => (a, b) =>
      numberCompare(orderBy)(a.status.stockImpact, b.status.stockImpact),
  },
  {
    id: 'volumeImpact',
    label: '出来高インパクト',
    comparator: (orderBy) => (a, b) =>
      numberCompare(orderBy)(a.status.volumeImpact, b.status.volumeImpact),
  },
];

const getComparator = (
  cellOptions: typeof headCells,
  order: Order,
  orderBy: keyof NewsItemRow | undefined
): ((a: NewsItem, b: NewsItem) => number) => {
  const cellOption = cellOptions.find((v) => v.id === orderBy);
  if (!cellOption) {
    return (x, y) =>
      (x.timestamp.getTime() - y.timestamp.getTime()) *
      (order === 'desc' ? -1 : 1);
  }

  return cellOption.comparator(order);
};

type NewsItemTableHeadProps = {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof NewsItemRow
  ) => void;
  order: Order;
  orderBy: OrderKey;
};

const NewsItemTableHead = ({
  order,
  orderBy,
  onRequestSort,
}: NewsItemTableHeadProps) => {
  const createSortHandler =
    (property: keyof NewsItemRow) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <Typography
                component="div"
                sx={{
                  fontSize: '0.775rem',
                  fontWeight: (theme) => theme.typography.fontWeightBold,
                }}
              >
                {headCell.label}
              </Typography>

              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export type NewsItemTableProps = {
  values: NewsItem[];
  onClickAddEvent?: React.MouseEventHandler<HTMLButtonElement>;
  onClickGroupEventLink?: (
    event: React.MouseEvent<HTMLElement>,
    groupEventId: string
  ) => void;
};

const NewsItemTable = ({
  values,
  onClickAddEvent,
  onClickGroupEventLink,
}: NewsItemTableProps) => {
  const [order, setOrder] = useState<Order>('asc');

  const [orderBy, setOrderBy] = useState<OrderKey>(undefined);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const searchHelperRef = useRef<Instance>(null);
  const searchBoxRef = useRef<HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchKeywords, setShowSearchKeywords] = useToggle(false);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof NewsItemRow
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickGroupEventLink =
    (targetId: string) => (event: React.MouseEvent<HTMLElement>) => {
      onClickGroupEventLink?.(event, targetId);
    };

  const handleChangeSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };

  const handleClickSearchKeyword: React.MouseEventHandler<HTMLElement> = (
    e
  ) => {
    const { keyword = '' } = e.currentTarget.dataset;
    setSearchQuery((prev) => `${prev} ${keyword}`);
    searchBoxRef.current?.focus();
  };

  const handleBlurSearchBox = () => {
    setTimeout(() => {
      const searchHelper = document.getElementsByClassName('searchHelper')[0];
      const isSearchKeywords = searchHelper?.contains(document.activeElement);
      setShowSearchKeywords(isSearchKeywords);
    }, 10);
  };

  const filterRows = useCallback(
    (value: NewsItem): boolean => {
      if (value.description.includes(searchQuery)) return true;
      if (value.category.label.includes(searchQuery)) return true;
      if (value.type.label.includes(searchQuery)) return true;
      return false;
    },
    [searchQuery]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Toolbar
        sx={{
          pl: 1,
        }}
      >
        <Typography variant="h6" mr={6}>
          ニュース一覧
        </Typography>
        <Row
          gap={4}
          sx={{
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            disableElevation
            onClick={onClickAddEvent}
          >
            イベント登録
          </Button>

          <FormControl>
            <TextField
              inputRef={searchBoxRef}
              name="searchQuery"
              margin="dense"
              type="search"
              variant="standard"
              size="small"
              value={searchQuery}
              onChange={handleChangeSearchQuery}
              // onClick={() => setShowSearchKeywords(true)}
              onFocus={() => setShowSearchKeywords(true)}
              onBlur={handleBlurSearchBox}
              // inputRef={searchBoxInputRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                placeholder: 'ニュースを検索',
                autoComplete: 'off',
              }}
            />
          </FormControl>
        </Row>
      </Toolbar>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
          <NewsItemTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {values
              .slice()
              .filter(filterRows)
              .sort(getComparator(headCells, order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover tabIndex={-1} key={row.id}>
                  <TableCell>{dayjs(row.timestamp).format('L LT')}</TableCell>
                  <TableCell>{row.category.label}</TableCell>
                  <TableCell>{row.type.label}</TableCell>
                  <TableCell>
                    {row.sourceRef ? (
                      <Link href={row.sourceRef} underline="hover">
                        {row.description}
                      </Link>
                    ) : (
                      <MuiLink
                        component="button"
                        underline="hover"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                        onClick={handleClickGroupEventLink(row.id)}
                      >
                        <Typography variant="inherit" textAlign="left">
                          {row.description}
                        </Typography>
                        <Box
                          sx={{
                            ml: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <EditRoundedIcon fontSize="small" />
                        </Box>
                      </MuiLink>
                    )}
                  </TableCell>
                  <TableCell>
                    {round(Decimal.mul(row.status.roc1d, 100).toNumber(), 1)}%
                  </TableCell>
                  <TableCell>
                    {round(Decimal.mul(row.status.roc5d, 100).toNumber(), 1)}%
                  </TableCell>
                  <TableCell>
                    {round(
                      Decimal.mul(row.status.stockImpact, 100).toNumber(),
                      1
                    )}
                    %
                  </TableCell>
                  <TableCell>
                    {round(
                      Decimal.mul(row.status.volumeImpact, 100).toNumber(),
                      1
                    )}
                    %
                  </TableCell>
                </TableRow>
              ))}

            {!values.length && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography textAlign="center">
                    すべてのデータが表示されました。
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        labelRowsPerPage="1ページあたりの行数"
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={values.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <HtmlTooltip
        className="searchHelper"
        open={showSearchKeywords}
        title={<SearchKeywords onClick={handleClickSearchKeyword} />}
        PopperProps={{
          popperRef: searchHelperRef,
          anchorEl: searchBoxRef.current,
        }}
        sx={{
          [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'transparent',
            border: 'none',
          },
        }}
      >
        <Box sx={{ width: 0, height: 0 }} />
      </HtmlTooltip>
    </Box>
  );
};

export default NewsItemTable;

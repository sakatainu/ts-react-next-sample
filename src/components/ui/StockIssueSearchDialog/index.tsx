import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useState } from 'react';
import SearchDialog, { SearchDialogProps } from '~/components/ui/SearchDialog';
import SearchResult from '~/components/ui/SearchDialog/SearchResult';
import { useSearch } from '~/hooks/useSearch';

type StockIssueSearchResultRenderer = (value: StockIssue[]) => React.ReactNode;
const defaultResultRenderer: StockIssueSearchResultRenderer = (stockIssue) =>
  stockIssue.map((v) => <Box key={v.code}>{v.name}</Box>);

type StockIssueSearchDialogProps = {
  open: boolean;
  searchSource?: StockIssue[];
  children?: StockIssueSearchResultRenderer;
  onClose?: SearchDialogProps['onClose'];
};

const StockIssueSearchResult = ({
  inputQuery,
  searchResult,
  resultRenderer: renderResult,
}: {
  inputQuery: string;
  searchResult: StockIssue[];
  resultRenderer: StockIssueSearchResultRenderer;
}) => {
  const showResult = !!inputQuery;
  const isEmptyResult = !searchResult.length;

  if (!showResult) {
    return (
      <Typography color={({ palette }) => palette.text.secondary}>
        ここに検索結果が表示されます。
      </Typography>
    );
  }

  if (isEmptyResult) {
    return (
      <Typography color={({ palette }) => palette.text.secondary}>
        <strong>{inputQuery}</strong> に関する銘柄が見つかりませんでした。
      </Typography>
    );
  }

  return (
    <>
      <Typography color={({ palette }) => palette.text.secondary}>
        <strong>{searchResult.length}件</strong>
        ヒットしました。
        {searchResult.length > 30 && '上位 30件 が表示されます。'}
      </Typography>
      <Stack spacing={2} pt={2}>
        {renderResult(searchResult.slice(0, 30))}
      </Stack>
    </>
  );
};

const StockIssueSearchDialog = ({
  open,
  searchSource,
  children: resultRenderer = defaultResultRenderer,
  onClose,
}: StockIssueSearchDialogProps) => {
  const [inputQuery, setInputQuery] = useState('');
  const stockSearcher = useSearch(searchSource ?? [], [
    'code',
    'name',
    'nameEn',
  ]);
  const [searchResult, setSearchResult] = useState<StockIssue[]>([]);

  const handleChangeQuery: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const q = e.currentTarget.value;
    setInputQuery(q);

    (async () => {
      setSearchResult(await stockSearcher(q));
    })();
  };

  return (
    <SearchDialog
      open={open}
      query={inputQuery}
      queryPlaceholder="銘柄コード、銘柄名で検索できます"
      onClose={onClose}
      onChangeQuery={handleChangeQuery}
    >
      <SearchResult>
        <StockIssueSearchResult
          inputQuery={inputQuery}
          searchResult={searchResult}
          resultRenderer={resultRenderer}
        />
      </SearchResult>
    </SearchDialog>
  );
};

export default StockIssueSearchDialog;

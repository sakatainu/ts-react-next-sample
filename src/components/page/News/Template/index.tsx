import {
  AddCircleOutlineRounded as AddCircleOutlineRoundedIcon,
  DoneRounded as DoneRoundedIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import SearchKeywords from '~/components/ui/SearchKeywords';
import SearchResultTemplate, {
  SearchResultTemplateProps,
} from '~/components/page/News/Template/SearchResultTemplate';
import Container from '~/components/ui/Container';
import ProgressBox from '~/components/ui/ProgressBox';
import SearchDialog, { SearchDialogProps } from '~/components/ui/SearchDialog';
import SearchResult from '~/components/ui/SearchDialog/SearchResult';
import Selector, { SelectorValue } from '~/components/ui/Selector';

export type TemplateProps = {
  searchProps: {
    inputValue?: string;
    onChangeQuery?: React.ChangeEventHandler<HTMLInputElement>;
    onSearch?: React.FormEventHandler<HTMLFormElement>;
    onClickSearchKeyword?: React.MouseEventHandler<HTMLElement>;
  };
  selectorProps: {
    value: SelectorValue[];
    onClickAdd?: () => void;
    onClickItemDelete?: (index: number, event: MouseEvent) => void;
  };
  searchResultProps: {
    showResult: boolean;
    loading: boolean;
    error: boolean;
    result?: SearchResultTemplateProps;
  };
  stockSearchDialogProps: {
    open: boolean;
    query: string;
    searchResult: StockIssue[];
    onChangeQuery?: SearchDialogProps['onChangeQuery'];
    onClose?: SearchDialogProps['onClose'];
    onClickResultItem?: (
      index: number,
      event: React.MouseEvent<HTMLButtonElement>
    ) => void;
  };
};

const Template = ({
  searchProps,
  selectorProps,
  searchResultProps,
  stockSearchDialogProps,
}: TemplateProps) => {
  const searchBoxInputRef = useRef<HTMLInputElement>(null);

  const [isSearchBoxActive, setIsSearchBoxActive] = useState(false);

  useEffect(() => {
    const handleOnClickDocument = () => {
      setIsSearchBoxActive(false);
    };
    document.addEventListener('click', handleOnClickDocument);
    return () => {
      document.removeEventListener('click', handleOnClickDocument);
    };
  }, []);

  const handleOnClickStockSearchDialogResult =
    (index: number): React.MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      stockSearchDialogProps.onClickResultItem?.(index, event);
    };

  const handleClickSearchBox: React.MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
    setIsSearchBoxActive(true);
  };

  const handleFocusSearchBox: React.FocusEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
    setIsSearchBoxActive(true);
  };

  const handleChangeSearchBox: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setIsSearchBoxActive(true);
    searchProps.onChangeQuery?.(e);
  };

  const handleClickSearchKeyword: React.MouseEventHandler<HTMLElement> = (
    e
  ) => {
    searchProps.onClickSearchKeyword?.(e);
    searchBoxInputRef.current?.focus();
    setIsSearchBoxActive(false);
  };

  const renderSearchResult = (value: TemplateProps['searchResultProps']) => {
    if (value.loading) return <ProgressBox />;
    if (value.error || !value.result) return <ProgressBox />;

    return <SearchResultTemplate {...value.result} />;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    setIsSearchBoxActive(false);
    searchProps.onSearch?.(e);
  };

  return (
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
            ニュース
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
        <Container>
          <Selector
            placeholder={
              <Button onClick={selectorProps.onClickAdd}>銘柄を選択する</Button>
            }
            value={selectorProps.value}
            onClickAdd={selectorProps.onClickAdd}
            onClickItemDelete={selectorProps.onClickItemDelete}
          />
          <FormControl fullWidth component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="searchQuery"
              margin="dense"
              type="search"
              value={searchProps.inputValue}
              onChange={handleChangeSearchBox}
              onClick={handleClickSearchBox}
              onFocus={handleFocusSearchBox}
              inputRef={searchBoxInputRef}
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
          <Popper
            open={isSearchBoxActive}
            anchorEl={searchBoxInputRef.current}
            placement="bottom-start"
          >
            <SearchKeywords onClick={handleClickSearchKeyword} />
          </Popper>
        </Container>
      </Box>
      <Container>
        <Box py={1}>
          {searchResultProps.showResult ? (
            renderSearchResult(searchResultProps)
          ) : (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
              }}
            >
              <Typography variant="body2">
                <b>銘柄</b>を選択するか、<b>検索ワード</b>
                を入力することで結果が表示されます。
              </Typography>
            </Paper>
          )}
        </Box>
      </Container>
      <SearchDialog
        open={stockSearchDialogProps.open}
        query={stockSearchDialogProps.query}
        queryPlaceholder="銘柄コード、銘柄名で検索できます"
        onClose={stockSearchDialogProps.onClose}
        onChangeQuery={stockSearchDialogProps.onChangeQuery}
      >
        <SearchResult>
          {!stockSearchDialogProps.query && (
            <Typography color={({ palette }) => palette.text.secondary}>
              ここに検索結果が表示されます。
            </Typography>
          )}
          {!stockSearchDialogProps.query ||
            (stockSearchDialogProps.searchResult.length ? (
              <>
                <Typography color={({ palette }) => palette.text.secondary}>
                  <strong>
                    {stockSearchDialogProps.searchResult.length}件
                  </strong>{' '}
                  ヒットしました。
                  {stockSearchDialogProps.searchResult.length > 30 &&
                    '上位 30件 が表示されます。'}
                </Typography>
                <Stack spacing={2} pt={2}>
                  {stockSearchDialogProps.searchResult
                    .slice(0, 30)
                    .map((v, i) => (
                      <Stack key={v.code} direction="row">
                        <Box flexGrow={1}>
                          <Typography variant="body2" component="h1">
                            {v.code}
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            component="h2"
                          >
                            {/* <Link href={`/home/company/${v.stockCode}`} underline="hover" onClick={e => e.stopPropagation()} display="inline-block"> */}
                            {v.name}
                            {/* </Link> */}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {selectorProps.value.some(
                            (selected) => v.code === selected.key
                          ) ? (
                            <IconButton disabled>
                              <DoneRoundedIcon color="success" />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={handleOnClickStockSearchDialogResult(i)}
                              disabled={selectorProps.value.some(
                                (selected) => v.code === selected.key
                              )}
                            >
                              <AddCircleOutlineRoundedIcon />
                            </IconButton>
                          )}
                        </Box>
                      </Stack>
                    ))}
                </Stack>
              </>
            ) : (
              <Typography color={({ palette }) => palette.text.secondary}>
                <strong>{stockSearchDialogProps.query}</strong>{' '}
                に関する銘柄が見つかりませんでした。
              </Typography>
            ))}
        </SearchResult>
      </SearchDialog>
    </>
  );
};

export default Template;

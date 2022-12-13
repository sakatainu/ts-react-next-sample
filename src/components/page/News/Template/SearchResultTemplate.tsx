import { Box, Pagination, Paper, Stack, Typography } from '@mui/material';
import ArticleEntry from '~/components/ui/ArticleEntry';
import Chip from '~/components/ui/Chip';
import Row from '~/components/ui/Row';
import { Article } from '~/hooks/useArticles';

export type SearchResultTemplateProps = {
  value: Article[];
  totalCount: number;
  page: number;
  pageCount: number;
  onChangePage?: (event: React.ChangeEvent<unknown>, page: number) => void;
};

const SearchResultTemplate = ({
  value,
  totalCount,
  page,
  pageCount,
  onChangePage,
}: SearchResultTemplateProps) => (
  <Box py={2}>
    <Typography>
      <b>{totalCount}</b> 件 / <b>{page}</b> ページ
    </Typography>
    <Box pt={2}>
      {value.length ? (
        <Stack gap={1}>
          {value.map((v) => (
            <ArticleEntry
              key={v.id}
              value={v}
              option={{
                ...(v.increaseKeywords?.length && {
                  subHeader: (
                    <>
                      <Typography variant="subtitle1" color="red">
                        新出キーワード
                      </Typography>
                      <Row gap={1} flexWrap="wrap">
                        {v.increaseKeywords.map((keyword) => (
                          <Chip
                            key={keyword}
                            size="small"
                            color="red"
                            label={keyword}
                          />
                        ))}
                      </Row>
                    </>
                  ),
                }),
              }}
            />
          ))}
        </Stack>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
          }}
        >
          <Typography variant="body2">
            検索条件に一致する結果が見つかりませんでした。
          </Typography>
        </Paper>
      )}
    </Box>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: 2,
      }}
    >
      <Pagination
        count={pageCount}
        page={page}
        color="primary"
        onChange={onChangePage}
      />
    </Box>
  </Box>
);

export default SearchResultTemplate;

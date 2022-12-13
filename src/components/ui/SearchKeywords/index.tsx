import { Box, Stack, Typography, Link as MuiLink, Paper } from '@mui/material';
import Row from '~/components/ui/Row';
import searchKeywords from './searchKeywords';

type SearchKeywordsProps = {
  onClick?: React.MouseEventHandler<HTMLElement>;
};
const SearchKeywords = ({ onClick }: SearchKeywordsProps) => (
  <Paper
    elevation={2}
    component={Box}
    sx={{ width: 560, p: 2 }}
    tabIndex={0}
    onClick={(e) => e.stopPropagation()}
  >
    <Typography variant="body1" fontWeight={600}>
      検索キーワード
    </Typography>
    <Stack p={1} gap={1}>
      {searchKeywords.map(([category, keywords]) => (
        <Box key={category}>
          <Box>
            <Typography variant="body2">{category}</Typography>
          </Box>
          <Row pl={1} gap={2}>
            {keywords.map((keyword) => (
              <MuiLink
                key={keyword}
                component="button"
                variant="body2"
                underline="hover"
                data-keyword={keyword}
                onClick={onClick}
              >
                {keyword}
              </MuiLink>
            ))}
          </Row>
        </Box>
      ))}
    </Stack>
  </Paper>
);

export default SearchKeywords;

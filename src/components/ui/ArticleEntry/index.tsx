import {
  Box,
  Card,
  CardActionArea,
  CardProps,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';
import dayjs from 'dayjs';
import { forwardRef, ReactElement } from 'react';
import Avatar from '~/components/ui/Avatar';
import Chip from '~/components/ui/Chip';
import Linker from '~/components/ui/Linker';
import Row from '~/components/ui/Row';
import { getRelativeTime } from '~/utils';

export type ArticleEntryValue = {
  id: string;
  distributor: {
    name: string;
    homepage?: string;
  };
  about: {
    name: string;
    homepage?: string;
    avatar?: string;
  };
  thumbnail?: string;
  title: string;
  content: string;
  publishedAt: Date;
  sourceRef: string;
};

export type ArticleEntryProps = Omit<CardProps, 'onClick'> & {
  value: ArticleEntryValue;
  option?: {
    status?: ReactElement;
    subHeader?: ReactElement;
  };
  onClick?: React.MouseEventHandler;
};

const ArticleEntry = forwardRef<HTMLDivElement, ArticleEntryProps>(
  ({ value, option, onClick, ...rest }, ref) => {
    const optionStatusBar = option?.status ? option.status : null;
    const optionSubHeader = option?.subHeader ? option.subHeader : null;

    return (
      <Card
        ref={ref}
        key={value.id}
        component="article"
        variant="outlined"
        {...rest}
      >
        <CardActionArea
          sx={{
            height: 1,
          }}
          onClick={onClick}
        >
          <Box
            sx={{
              boxSizing: 'border-box',
              height: 1,
              p: 2,
            }}
          >
            <Row spacing={2} height={1}>
              <Box>
                <Linker href={value.about.homepage}>
                  <Avatar
                    variant="square"
                    src={value.about.avatar}
                    sx={{
                      width: 56,
                      height: 56,
                    }}
                    label={value.about.name}
                  />
                </Linker>
              </Box>
              <Stack minWidth={0} flexGrow={1}>
                <Row spacing={2} alignItems="center">
                  <Box flexGrow={1}>
                    <Chip
                      {...(value.distributor?.homepage && {
                        component: Linker,
                        href: value.distributor.homepage,
                        clickable: true,
                      })}
                      size="small"
                      variant="outlined"
                      label={value.distributor.name}
                    />
                  </Box>
                  {optionStatusBar && <Box>{optionStatusBar}</Box>}
                  <Tooltip
                    disableFocusListener
                    title={dayjs(value.publishedAt).format('LLL')}
                  >
                    {dayjs(value.publishedAt).isBefore(
                      dayjs().add(-1, 'day'),
                      'day'
                    ) ? (
                      <Typography
                        variant="caption"
                        component="time"
                        dateTime={value.publishedAt.toISOString()}
                      >
                        {getRelativeTime(value.publishedAt)}
                      </Typography>
                    ) : (
                      <Chip
                        component="time"
                        label={getRelativeTime(value.publishedAt)}
                        dateTime={value.publishedAt.toISOString()}
                        size="small"
                        sx={{
                          backgroundColor: red[100],
                          color: red[500],
                        }}
                      />
                    )}
                  </Tooltip>
                </Row>
                <Box mt={1}>
                  <Typography variant="subtitle2">
                    <Linker
                      href={value.about.homepage}
                      underline="hover"
                      onClick={(e) => e.preventDefault()}
                    >
                      {value.about.name}
                    </Linker>
                  </Typography>
                </Box>
                <Typography
                  component="h1"
                  fontSize="1.125rem"
                  fontWeight="bold"
                  mt={1}
                  sx={{
                    overflowWrap: 'break-word',
                  }}
                >
                  <Linker
                    href={value.sourceRef}
                    underline="hover"
                    color="inherit"
                    display="block"
                    onClick={(e) => e.preventDefault()}
                  >
                    {value.title}
                  </Linker>
                </Typography>
                {optionSubHeader}
                <Typography
                  component="p"
                  variant="body2"
                  color="gray"
                  sx={{
                    mt: 1,
                    overflowWrap: 'break-word',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    position: 'relative',
                    '::before': {
                      content: '""',
                      display: 'block',
                      width: 1,
                      height: 1,
                      background:
                        'linear-gradient(rgba(255,255,255,0) 70%, rgba(255,255,255))',
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                    },
                  }}
                >
                  {value.content.slice(0, 120)}
                </Typography>
              </Stack>
            </Row>
          </Box>
        </CardActionArea>
      </Card>
    );
  }
);
ArticleEntry.displayName = 'ArticleEntry';

export default ArticleEntry;

import {
  FolderOpenOutlined as FolderOpenOutlinedIcon,
  FolderOutlined as FolderOutlinedIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Tooltip,
  Typography,
} from '@mui/material';
import { useToggle } from 'react-use';
import AppSideSubMenu from '~/components/ui/AppSideMenu/AppSideSubMenu';
import Avatar from '~/components/ui/Avatar';
import Link from '~/components/ui/Link';
import ProgressBox from '~/components/ui/ProgressBox';
import Row from '~/components/ui/Row';
import { useGroupContext } from '~/contexts/GroupContext';
import useGroupStockIssueLists, {
  GroupStockIssueList,
} from '~/hooks/useGroupStockIssueLists';
import useUrlQuery from '~/hooks/useUrlQuery';
import { removeLegalType } from '~/utils';

const groupHomePath = '/home/groups';

const textEllipsis = {
  overflowX: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const WatchFolder = ({
  value,
  path,
  selected,
}: {
  value: GroupStockIssueList;
  path: string;
  selected: boolean;
}) => {
  const { id, groupId, name, items } = value;
  const [openFolder, toggleOpenFolder] = useToggle(true);

  const handleClickToggleExpand: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();
    e.stopPropagation();

    toggleOpenFolder();
  };

  return (
    <>
      <ListItemButton
        LinkComponent={Link}
        href={`${groupHomePath}/${groupId}${path}?id=${id}`}
        sx={{
          p: '0 16px 0 8px',
          position: 'relative',
          ...(selected && {
            backgroundColor: 'action.selected',
          }),
          '::after': {
            display: selected ? 'block' : 'none',
            content: '""',
            position: 'absolute',
            width: 8,
            height: 1,
            left: 0,
            backgroundColor: 'primary.main',
          },
        }}
      >
        <IconButton onClick={handleClickToggleExpand}>
          {openFolder ? <FolderOpenOutlinedIcon /> : <FolderOutlinedIcon />}
        </IconButton>
        <ListItemText
          primary={name}
          sx={{
            '& .MuiTypography-root': textEllipsis,
          }}
        />
      </ListItemButton>
      <Collapse in={openFolder} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map((v) => (
            <ListItemButton
              key={v.id}
              LinkComponent={Link}
              href={`${groupHomePath}/${groupId}${path}?compares=${v.stockIssue.code}`}
              sx={{ pl: 4, pr: 2, py: 0.5 }}
            >
              <Tooltip title={v.stockIssue.name}>
                <Row sx={{ alignItems: 'center' }}>
                  <Avatar
                    label={v.stockIssue.name}
                    src={v.stockIssue.avatar}
                    sx={{
                      width: 24,
                      height: 24,
                      mr: 1,
                      fontSize: 9,
                    }}
                  />
                  <Typography variant="button" sx={textEllipsis}>
                    ({v.stockIssue.code}){removeLegalType(v.stockIssue.name)}
                  </Typography>
                </Row>
              </Tooltip>
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export type CompareProps = {
  path: string;
};

const Compare = ({ path }: CompareProps) => {
  const { id: idParam = [] } = useUrlQuery();
  const groupStockIssueListId = idParam.at(0);
  const { group } = useGroupContext();
  const { fetching, result } = useGroupStockIssueLists(group.id);

  const renderContent = () => {
    if (fetching) return <ProgressBox />;
    if (!result?.value.length) {
      return (
        <>
          <Typography variant="caption">
            ウォッチリストが作成されていません
          </Typography>
          <Box py={1}>
            <Button
              variant="outlined"
              LinkComponent={Link}
              href={`/home/groups/${group.id}${path}`}
            >
              作成画面に移動
            </Button>
          </Box>
        </>
      );
    }

    return (
      <List
        component="div"
        subheader={
          <ListSubheader
            component="div"
            sx={{
              fontWeight: 'bold',
            }}
          >
            ウォッチリスト
          </ListSubheader>
        }
        dense
        disablePadding
        // sx={{
        //   p: 0,
        // }}
      >
        {result.value.map((v) => (
          <WatchFolder
            key={v.id}
            value={v}
            path={path}
            selected={v.id === groupStockIssueListId}
          />
        ))}
      </List>
    );
  };
  return (
    <AppSideSubMenu
      sx={{
        backgroundColor: 'white',
      }}
    >
      {/* <Typography px={1} py={2} fontWeight="bold">
        ウォッチリスト
      </Typography> */}
      <Box>{renderContent()}</Box>
    </AppSideSubMenu>
  );
};

export default Compare;

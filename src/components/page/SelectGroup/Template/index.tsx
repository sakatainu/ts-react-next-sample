import {
  Avatar as MuiAvatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material';
import React, { useMemo } from 'react';
import Container from '~/components/ui/Container';
import Link from '~/components/ui/Link';
import Row from '~/components/ui/Row';
import { Group, InvitedGroup } from '~/hooks/useGroups';
import { getAvatarColor, getFontColor } from '~/utils/index';

const Avatar = ({ label }: { label: string }) => {
  const bgcolor = useMemo(() => getAvatarColor(label), [label]);
  const color = useMemo(() => getFontColor(getAvatarColor(label)), [label]);

  return (
    <MuiAvatar
      sx={{
        width: 32,
        height: 32,
        bgcolor,
        color,
      }}
    >
      <Typography variant="body1">{label[0]}</Typography>
    </MuiAvatar>
  );
};

const GroupList = ({ value }: { value: Group[] }) => {
  if (!value.length) return null;

  return (
    <List subheader={<ListSubheader>所属中の企業アカウント</ListSubheader>}>
      {value.map((v) => (
        <React.Fragment key={v.id}>
          <ListItemButton
            LinkComponent={Link}
            href={`/home/groups/${v.id}/analytics`}
            sx={{
              py: 2,
            }}
          >
            <Row
              sx={{
                flexGrow: 1,
                alignItems: 'center',
              }}
            >
              <Avatar label={v.name} />
              <Box
                sx={{
                  flexGrow: 1,
                }}
              >
                <Typography variant="subtitle1" ml={3} noWrap>
                  {v.name}
                </Typography>
              </Box>
              <Stack>
                <Typography variant="body1">
                  {v.userNum.aggregate?.count}
                  {' 人のユーザー'}
                </Typography>
              </Stack>
            </Row>
          </ListItemButton>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  );
};

const InvitedGroupList = ({
  value,
  onClickAcceptInvited,
}: {
  value: InvitedGroup[];
  onClickAcceptInvited: (
    invited: InvitedGroup,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
}) => {
  if (!value.length) return null;

  const handleClickAcceptInvited =
    (invited: InvitedGroup): React.MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      onClickAcceptInvited(invited, e);
    };

  return (
    <List
      subheader={
        <ListSubheader sx={{ fontWeight: 'bold' }}>
          次のアカウントから招待を受けています。
        </ListSubheader>
      }
    >
      {value.map((v) => (
        <React.Fragment key={v.id}>
          <ListItem
            sx={{
              py: 2,
            }}
          >
            <Row sx={{ flexGrow: 1, alignItems: 'center' }}>
              <Row sx={{ flexGrow: 1, alignItems: 'center' }}>
                <Avatar label={v.name} />
                <Typography variant="subtitle1" ml={3} noWrap>
                  {v.name}
                </Typography>
              </Row>
              <Button variant="outlined" onClick={handleClickAcceptInvited(v)}>
                承認してメンバーになる
              </Button>
            </Row>
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  );
};

export type TemplateProps = {
  value: {
    invited: InvitedGroup[];
    groups: Group[];
  };
  onClickAcceptInvite: (
    invited: InvitedGroup,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
};

const Content = ({ value, onClickAcceptInvite }: TemplateProps) => {
  const { groups, invited } = value;

  if (!groups.length && !invited.length)
    return <Typography my={2}>表示可能なアカウントがありません。</Typography>;

  return (
    <>
      <InvitedGroupList
        value={invited}
        onClickAcceptInvited={onClickAcceptInvite}
      />
      <GroupList value={groups} />
    </>
  );
};

const Template = ({ value, onClickAcceptInvite }: TemplateProps) => (
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
          アカウント選択
        </Typography>
      </Container>
    </Box>
    <Box
      sx={{
        py: 2,
        flexGrow: 1,
        height: 1,
        backgroundColor: 'background.paper',
      }}
    >
      <Container>
        <Content value={value} onClickAcceptInvite={onClickAcceptInvite} />
      </Container>
    </Box>
  </>
);

export default Template;

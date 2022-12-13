import { SelectMembershipsQuery } from '@/generated/graphql';
import {
  Add as AddIcon,
  MoreHoriz as MoreHorizIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  type TableCellProps,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { useToggle } from 'react-use';
import GroupInfoNav from '~/components/App/GroupInfoNav';
import Container from '~/components/ui/Container';
import Row from '~/components/ui/Row';
import { useGroupContext } from '~/contexts/GroupContext';
import { useGroupAuthUtils } from '~/hooks/authUtils';
import MemberContextMenu, { MemberContextMenuProps } from './MemberContextMenu';

const tableHead: (TableCellProps & { label: string })[] = [
  { id: 'name', label: '氏名', align: 'left' },
  { id: 'mailAddress', label: 'Eメール', align: 'center' },
  { id: 'role', label: 'ロール', align: 'center' },
  { id: 'status', label: 'ステータス', align: 'center' },
  { id: 'action', label: '操作', align: 'center' },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export type GroupMember = SelectMembershipsQuery['memberships'][number];

export type TemplateProps = {
  groupMembers: GroupMember[];
  onClickInviteMember: React.MouseEventHandler<HTMLButtonElement>;
  onClickDeleteMember: (
    target: GroupMember,
    event: React.MouseEvent<HTMLElement>
  ) => void;
  onClickReinvite: (
    target: GroupMember,
    event: React.MouseEvent<HTMLElement>
  ) => void;
  onChangeMemberRole: (
    target: GroupMember,
    event: SelectChangeEvent<'member' | 'owner'>
  ) => void;
};

const Template = ({
  groupMembers,
  onClickInviteMember,
  onClickDeleteMember,
  onClickReinvite,
  onChangeMemberRole,
}: TemplateProps) => {
  const { group, userGroupRole } = useGroupContext();
  const { GroupPermission, allow } = useGroupAuthUtils(userGroupRole);

  const contextMenuAnchorRef = useRef<HTMLElement | null>(null);
  const [openContextMenu, setOpenContextMenu] = useToggle(false);
  const [selectedMember, setSelectedMember] =
    useState<MemberContextMenuProps['member']>(null);

  const handleClickOpenContextMenu =
    (targetMember: MemberContextMenuProps['member']) =>
    (e: React.MouseEvent<HTMLElement>) => {
      contextMenuAnchorRef.current = e.currentTarget;
      setSelectedMember(targetMember);
      setOpenContextMenu(true);
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
            ユーザー管理
          </Typography>
        </Container>
      </Box>
      <Paper variant="elevation" elevation={0} square sx={{ py: 4, pb: 10 }}>
        <Container>
          <Row sx={{ py: 2, gap: 2 }}>
            <GroupInfoNav currentPath="members" />
            <Box sx={{ flexGrow: 1 }}>
              <Row alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography>
                    <b>{group.name}</b> に所属するユーザー
                  </Typography>
                </Box>
                <GroupPermission allows={['staff', 'owner']}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={onClickInviteMember}
                  >
                    ユーザーの招待
                  </Button>
                </GroupPermission>
              </Row>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {tableHead.map((column) => (
                        <StyledTableCell key={column.id} align={column.align}>
                          {column.label}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!groupMembers.length && (
                      <TableRow>
                        <TableCell>ユーザーが存在しません。</TableCell>
                      </TableRow>
                    )}
                    {groupMembers.map((v) => (
                      <TableRow key={v.userId}>
                        <TableCell component="th" scope="row">
                          {v.user?.name || v.groupInvitation?.name}
                        </TableCell>
                        <TableCell align="center">
                          {v.user?.email || v.groupInvitation?.email}
                        </TableCell>
                        <TableCell align="center">
                          {allow(['staff', 'owner']) ? (
                            <FormControl>
                              <Select
                                value={v?.ownership ? 'owner' : 'member'}
                                variant="standard"
                                onChange={(e) => onChangeMemberRole(v, e)}
                              >
                                <MenuItem value="member">メンバー</MenuItem>
                                <MenuItem value="owner">オーナー</MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            <>{v?.ownership ? 'オーナー' : 'メンバー'}</>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            variant="outlined"
                            color={v.groupInvitation ? 'warning' : 'success'}
                            label={v.groupInvitation ? '招待中' : '利用中'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={handleClickOpenContextMenu(v)}
                            size="small"
                          >
                            <MoreHorizIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Row>
        </Container>
        <MemberContextMenu
          anchorEl={contextMenuAnchorRef.current}
          open={openContextMenu}
          member={selectedMember}
          onClose={() => setOpenContextMenu(false)}
          onClickDeleteMember={(e) =>
            selectedMember && onClickDeleteMember(selectedMember, e)
          }
          onClickReinvite={(e) =>
            selectedMember && onClickReinvite(selectedMember, e)
          }
        />
      </Paper>
    </>
  );
};

export default Template;

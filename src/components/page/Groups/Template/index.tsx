import { Add as AddIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  type TableCellProps,
} from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import Container from '~/components/ui/Container';
import Link from '~/components/ui/Link';
import Row from '~/components/ui/Row';
import { useMasterTypesContext } from '~/contexts/MasterTypesContext';
import { useSignedInUserContext } from '~/contexts/SignedInUserContext';
import { useAuthUtils } from '~/hooks/authUtils';
import { Group } from '~/hooks/useGroups';
import AccountContextMenu from './AccountContextMenu';

const tableHead: (TableCellProps & { label: string })[] = [
  { id: 'name', label: 'アカウント', align: 'left' },
  { id: 'userNum', label: 'ユーザー数/上限', align: 'center' },
  { id: 'plan', label: 'プラン', align: 'center' },
  { id: 'endingAt', label: '利用期限', align: 'right' },
  // { id: 'createdAt', label: '登録日', align: 'right' },
  { id: 'status', label: 'ステータス', align: 'center' },
  { id: 'action', label: '操作', align: 'center' },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export type TemplateProps = {
  groups: Group[];
  onClickCreateGroup: React.MouseEventHandler<HTMLButtonElement>;
};

const Template = ({ groups, onClickCreateGroup }: TemplateProps) => {
  const { user } = useSignedInUserContext();
  const { planTypes: plans } = useMasterTypesContext();
  const { UserPermission } = useAuthUtils(user.role);

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
            アカウント管理
          </Typography>
        </Container>
      </Box>
      <Paper variant="elevation" elevation={0} square sx={{ py: 4, pb: 10 }}>
        <Container>
          <Row alignItems="center" justifyContent="space-between" mb={2}>
            <Box>
              <Typography>企業アカウント一覧</Typography>
            </Box>
            <UserPermission allows={['staff']}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={onClickCreateGroup}
              >
                アカウントの新規作成
              </Button>
            </UserPermission>
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
                {!groups.length && (
                  <TableRow>
                    <TableCell>アカウントが存在しません。</TableCell>
                  </TableRow>
                )}
                {groups.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell component="th" scope="row">
                      <Link
                        href={`/home/groups/${v.id}/info`}
                        underline="hover"
                      >
                        {v.name}
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      {v.userNum.aggregate?.count}/{v.contract?.maxUsers}
                    </TableCell>
                    <TableCell align="center">
                      {
                        plans.find(
                          (plan) => plan.code === v.contract?.plan?.code
                        )?.label[0].text
                      }
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip
                        title={`期限: ${dayjs(v.contract?.expireAt).format(
                          'LLL'
                        )}`}
                      >
                        <Typography fontSize="inherit">
                          残り{dayjs(v.contract?.expireAt).diff(dayjs(), 'd')}日
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      有効
                      {/* {v.inactiveGroup === null ? '有効' : '無効'} */}
                    </TableCell>
                    <TableCell align="center">
                      <AccountContextMenu value={v} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Paper>
    </>
  );
};
export default Template;

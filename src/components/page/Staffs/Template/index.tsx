import { Add as AddIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableCellProps,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Container from '~/components/ui/Container';
import { Staff, InvitingStaff } from '../type';
import StaffEditButton from './StaffEditButton';

const tableHead: (TableCellProps & { label: string })[] = [
  { id: 'name', label: 'スタッフ名', align: 'left' },
  { id: 'email', label: 'Eメール', align: 'left' },
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

// interface TablePaginationActionsProps {
//   count: number;
//   page: number;
//   rowsPerPage: number;
//   onPageChange: (
//     event: React.MouseEvent<HTMLButtonElement>,
//     newPage: number
//   ) => void;
// }

// const TablePaginationActions = (props: TablePaginationActionsProps) => {
//   const theme = useTheme();
//   const { count, page, rowsPerPage, onPageChange } = props;

//   const handleFirstPageButtonClick = (
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     onPageChange(event, 0);
//   };

//   const handleBackButtonClick = (
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     onPageChange(event, page - 1);
//   };

//   const handleNextButtonClick = (
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     onPageChange(event, page + 1);
//   };

//   const handleLastPageButtonClick = (
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
//   };

//   return (
//     <Box sx={{ flexShrink: 0, ml: 2.5 }}>
//       <IconButton
//         onClick={handleFirstPageButtonClick}
//         disabled={page === 0}
//         aria-label="first page"
//       >
//         {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
//       </IconButton>
//       <IconButton
//         onClick={handleBackButtonClick}
//         disabled={page === 0}
//         aria-label="previous page"
//       >
//         {theme.direction === 'rtl' ? (
//           <KeyboardArrowRight />
//         ) : (
//           <KeyboardArrowLeft />
//         )}
//       </IconButton>
//       <IconButton
//         onClick={handleNextButtonClick}
//         disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//         aria-label="next page"
//       >
//         {theme.direction === 'rtl' ? (
//           <KeyboardArrowLeft />
//         ) : (
//           <KeyboardArrowRight />
//         )}
//       </IconButton>
//       <IconButton
//         onClick={handleLastPageButtonClick}
//         disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//         aria-label="last page"
//       >
//         {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
//       </IconButton>
//     </Box>
//   );
// };

export type TemplateProps = {
  staffsProps: {
    value: (Staff | InvitingStaff)[];
    loading: boolean;
  };

  onClickInviteStaff: React.MouseEventHandler<HTMLButtonElement>;
  onClickDeleteStaff: (user: User, e: React.MouseEvent<HTMLElement>) => void;
};

const Template = ({
  staffsProps,
  onClickInviteStaff,
  onClickDeleteStaff,
}: TemplateProps) => (
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
          スタッフ管理
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
      <Container sx={{ height: '100vh' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box sx={{ py: 3 }}>
            <Typography>スタッフ</Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onClickInviteStaff}
          >
            スタッフの招待
          </Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 600 }} aria-label="custom pagination table">
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
              {staffsProps.value.map((v) => (
                <TableRow key={v.email}>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.email}</TableCell>
                  <TableCell align="center">{v.status}</TableCell>
                  <TableCell align="center">
                    <StaffEditButton
                      value={v}
                      onClickDeleteStaff={onClickDeleteStaff}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {/* <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: 'All', value: -1 },
                    ]}
                    colSpan={3}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter> */}
          </Table>
        </TableContainer>
      </Container>
    </Box>
  </>
);
export default Template;

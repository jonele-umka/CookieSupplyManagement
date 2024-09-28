import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import { formatDate } from "../../FormatDate/FormatDate";
import { useDispatch } from "react-redux";
import { fetchCookies } from "../../../Store/сookieSlice/cookieSlice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function WarehouseTable({ cookies, token }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchCookies({ token, page, pageSize: rowsPerPage }));
  }, [dispatch, token, page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Paper>
      <TableContainer>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>№</StyledTableCell>
              <StyledTableCell>Название печенья</StyledTableCell>
              <StyledTableCell align="right">Цена</StyledTableCell>
              <StyledTableCell align="right">
                Количество коробок
              </StyledTableCell>
              <StyledTableCell align="right">Килограмм печенья</StyledTableCell>
              <StyledTableCell align="right">Дата добавления</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cookies?.data?.map((cookie, index) => (
              <StyledTableRow key={cookie.id || index}>
                <StyledTableCell component="th" scope="row">
                  {(page - 1) * rowsPerPage + index + 1}
                </StyledTableCell>
                <StyledTableCell>{cookie?.name}</StyledTableCell>
                <StyledTableCell align="right">{cookie?.price}</StyledTableCell>
                <StyledTableCell align="right">
                  {cookie?.quantity}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {cookie?.type?.weight}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {formatDate(cookie?.createdAt)}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        color="primary"
        count={Math.ceil((cookies?.total || 0) / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        sx={{ display: "flex", padding: 2 }}
      />
    </Paper>
  );
}

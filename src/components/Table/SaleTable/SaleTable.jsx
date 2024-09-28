import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import { useDispatch } from "react-redux";
import { fetchSale } from "../../../Store/saleSlice/saleSlice";

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

export default function SaleTable({ sale, token }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchSale({ token, page, pageSize: rowsPerPage }));
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
              <StyledTableCell>Магазин</StyledTableCell>
              <StyledTableCell align="right">Вид печенья</StyledTableCell>
              <StyledTableCell align="right">Количество</StyledTableCell>
              <StyledTableCell align="right">Дата продажи</StyledTableCell>
              <StyledTableCell align="right">Сумма продажи</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sale?.data?.map((saleItem, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {(page - 1) * rowsPerPage + index + 1}
                </StyledTableCell>
                <StyledTableCell>{saleItem?.store?.name}</StyledTableCell>
                <StyledTableCell align="right">
                  {saleItem?.cookie?.name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {saleItem?.quantity}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {saleItem?.date}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {saleItem?.price}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Пагинация */}
      <Pagination
        color="primary"
        count={Math.ceil((sale?.total || 0) / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        sx={{ display: "flex", padding: 2 }}
      />
    </Paper>
  );
}

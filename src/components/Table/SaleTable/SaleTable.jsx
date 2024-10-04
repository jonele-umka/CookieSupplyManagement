import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";

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

export default function SaleTable({
  sale,
  totalCount,
  handleChangePage,
  page,
  rowsPerPage,
}) {
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
              <StyledTableRow key={saleItem.id}>
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
      {sale && sale.total > 0 && (
        <Pagination
          color="primary"
          page={page}
          count={Math.ceil(totalCount / rowsPerPage)}
          onChange={handleChangePage}
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        />
      )}
    </Paper>
  );
}

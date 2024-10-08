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
import ModalPayments from "../../Modal/ModalPayments/ModalPayments";
import ModalStoreHistory from "../../Modal/ModalStoreHistory/ModalStoreHistory";

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

export default function StoreTable({
  openModal,
  storeHistory,
  openPaymentModal,
  selectedStoreId,
  handleChangePage,
  handleOpenModal,
  handleOpenPaymentModal,
  handleCloseModal,
  handleClosePaymentModal,
  totalCount,
  rowsPerPage,
  stores,
  page,
  token,
}) {
  return (
    <Paper>
      <TableContainer>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>№</StyledTableCell>
              <StyledTableCell>Название магазина</StyledTableCell>
              <StyledTableCell align="right">Адрес</StyledTableCell>
              <StyledTableCell align="right">Контактное лицо</StyledTableCell>
              <StyledTableCell align="right">Номер телефона</StyledTableCell>
              <StyledTableCell align="right">Задолженность</StyledTableCell>
              <StyledTableCell align="right">История продаж</StyledTableCell>
              <StyledTableCell align="right">Оплатить</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores?.data?.map((store, index) => (
              <StyledTableRow key={store.id}>
                <StyledTableCell component="th" scope="row">
                  {(page - 1) * rowsPerPage + index + 1}
                </StyledTableCell>
                <StyledTableCell>{store?.name}</StyledTableCell>
                <StyledTableCell align="right">
                  {store?.address}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {store?.contact}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {store?.phone_number}
                </StyledTableCell>
                <StyledTableCell align="right">{store?.debt}</StyledTableCell>
                <StyledTableCell align="right">
                  <button
                    style={{
                      backgroundColor: "rgb(230, 91, 114)",
                      paddingTop: 10,
                      paddingRight: 5,
                      paddingBottom: 10,
                      paddingLeft: 5,
                      borderRadius: 5,
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpenModal(store)}
                  >
                    <h4 style={{ color: "#fff", fontWeight: 600 }}>
                      Показать историю
                    </h4>
                  </button>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <button
                    style={{
                      backgroundColor: "rgb(14, 126, 59)",
                      paddingTop: 10,
                      paddingRight: 5,
                      paddingBottom: 10,
                      paddingLeft: 5,
                      borderRadius: 5,
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpenPaymentModal(store)}
                  >
                    <h4 style={{ color: "#fff", fontWeight: 600 }}>Оплатить</h4>
                  </button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {stores && stores.total > 0 && (
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
      <ModalStoreHistory
        open={openModal}
        handleClose={handleCloseModal}
        storeHistory={storeHistory}
        StyledTableCell={StyledTableCell}
        StyledTableRow={StyledTableRow}
      />
      <ModalPayments
        open={openPaymentModal}
        handleClose={handleClosePaymentModal}
        storeId={selectedStoreId}
        token={token}
      />
    </Paper>
  );
}

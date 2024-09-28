import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";

import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 700 }, 
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

const ModalStoreHistory = ({
  open,
  handleClose,
  storeHistory,
  StyledTableCell,
  StyledTableRow,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          История продаж
        </Typography>
        {storeHistory?.payment && storeHistory.payment.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table aria-label="customized table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Продукт</StyledTableCell>
                  <StyledTableCell>Контактное лицо</StyledTableCell>
                  <StyledTableCell>Адрес</StyledTableCell>
                  <StyledTableCell>Задолженность</StyledTableCell>
                  <StyledTableCell>Цена</StyledTableCell>
                  <StyledTableCell>Дата</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {storeHistory.payment
                  .slice()
                  .reverse()
                  .map((sale, index) => (
                    <TableRow key={index}>
                      <StyledTableCell>{storeHistory.name}</StyledTableCell>
                      <StyledTableCell>{storeHistory.contact}</StyledTableCell>
                      <StyledTableCell>{storeHistory.address}</StyledTableCell>
                      <StyledTableCell>{storeHistory.debt}</StyledTableCell>
                      <StyledTableCell>{sale.price}</StyledTableCell>
                      <StyledTableCell>{sale.date}</StyledTableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            История продаж отсутствует
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ModalStoreHistory;

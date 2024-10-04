import React, { useEffect, useState } from "react";
import WarehouseTable from "../../components/Table/WarehouseTable/WarehouseTable";
import ModalAddCoockies from "../../components/Modal/ModalAddCoockies/ModalAddCoockies";
import { useDispatch, useSelector } from "react-redux";
import { fetchCookies } from "../../Store/сookieSlice/cookieSlice";

export const WarehousePages = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const token = useSelector((state) => state.auth.token);
  const cookies = useSelector((state) => state.cookies.cookies);

  const handleOpenMainModal = () => setModalOpen(true);
  const handleCloseMainModal = () => setModalOpen(false);

  useEffect(() => {
    dispatch(fetchCookies({ token, page, pageSize: rowsPerPage }));
  }, [dispatch, token, page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const totalCount = cookies?.total ? cookies.total : 0;
  return (
    <div className="page">
      <h1 className="title">Склад</h1>

      <div className="totalBlock">
        <h1 className="total">Количество: {cookies?.total}</h1>

        <button
          variant="contained"
          color="primary"
          className="addButton"
          onClick={handleOpenMainModal}
        >
          Добавить
        </button>
      </div>

      <WarehouseTable
        cookies={cookies}
        totalCount={totalCount}
        handleChangePage={handleChangePage}
        page={page}
        rowsPerPage={rowsPerPage}
      />
      <ModalAddCoockies open={modalOpen} handleClose={handleCloseMainModal} />
    </div>
  );
};

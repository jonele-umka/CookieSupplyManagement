import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalAddSale from "../../components/Modal/ModalAddSale/ModalAddSale";
import SaleTable from "../../components/Table/SaleTable/SaleTable";
import { fetchSale } from "../../Store/saleSlice/saleSlice";

export const SalePages = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const stores = useSelector((state) => state.store.store);
  const sale = useSelector((state) => state.sale.sale);
  const cookies = useSelector((state) => state.cookies.cookies);
  const token = useSelector((state) => state.auth.token);

  const handleOpenMainModal = () => setModalOpen(true);
  const handleCloseMainModal = () => setModalOpen(false);

  useEffect(() => {
    dispatch(fetchSale({ token, page, pageSize: rowsPerPage }));
  }, [dispatch, token, page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const totalCount = sale?.total ? sale.total : 0;

  return (
    <div className="page">
      <h1 className="title">Продажи</h1>
      <div className="totalBlock">
        <h1 className="total">Количество: {sale.total}</h1>

        <button className="addButton" onClick={handleOpenMainModal}>
          Добавить
        </button>
      </div>
      <SaleTable
        sale={sale}
        totalCount={totalCount}
        handleChangePage={handleChangePage}
        page={page}
        rowsPerPage={rowsPerPage}
      />
      <ModalAddSale
        cookies={cookies}
        stores={stores}
        open={modalOpen}
        handleClose={handleCloseMainModal}
      />
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import StoreTable from "../../components/Table/StoreTable/StoreTable";
import ModalAddStore from "../../components/Modal/ModalAddStore/ModalAddStore";
import { fetchStore } from "../../Store/storeSlice/storeSlice";

export const StoresPages = () => {
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.store.store);
  const token = useSelector((state) => state.auth.token);

  const [addmodalOpen, setAddModalOpen] = useState(false);
  const handleOpenMainModal = () => setAddModalOpen(true);
  const handleCloseMainModal = () => setAddModalOpen(false);

  const [openModal, setOpenModal] = useState(false);
  const [storeHistory, setStoreHistory] = useState([]);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchStore({ token, page, pageSize: rowsPerPage }));
  }, [dispatch, token, page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenModal = async (store) => {
    try {
      const response = await fetch(
        `http://91.218.140.135:8080/api/store/${store.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      const data = await response.json();
      setStoreHistory(data);
      setOpenModal(true);
    } catch (error) {
      console.error("Ошибка при загрузке данных истории продаж:", error);
    }
  };

  const handleOpenPaymentModal = (store) => {
    setSelectedStoreId(store.id);
    setOpenPaymentModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
  };
  const totalCount = stores?.total ? stores.total : 0;

  return (
    <div className="page">
      <h1 className="title">Магазины</h1>

      <div className="totalBlock">
        <h1 className="total">Количество: {stores.total}</h1>

        <button
          variant="contained"
          color="primary"
          className="addButton"
          onClick={handleOpenMainModal}
        >
          Добавить
        </button>
      </div>

      <StoreTable
        openModal={openModal}
        storeHistory={storeHistory}
        openPaymentModal={openPaymentModal}
        selectedStoreId={selectedStoreId}
        handleChangePage={handleChangePage}
        handleOpenModal={handleOpenModal}
        handleOpenPaymentModal={handleOpenPaymentModal}
        handleCloseModal={handleCloseModal}
        handleClosePaymentModal={handleClosePaymentModal}
        totalCount={totalCount}
        rowsPerPage={rowsPerPage}
        stores={stores}
        page={page}
        token={token}
      />
      <ModalAddStore open={addmodalOpen} handleClose={handleCloseMainModal} />
    </div>
  );
};

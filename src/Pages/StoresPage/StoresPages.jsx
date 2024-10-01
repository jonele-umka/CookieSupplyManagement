import React, { useState } from "react";
import { useSelector } from "react-redux";

import StoreTable from "../../components/Table/StoreTable/StoreTable";
import ModalAddStore from "../../components/Modal/ModalAddStore/ModalAddStore";

export const StoresPages = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const stores = useSelector((state) => state.store.store);
console.log(stores)
  const handleOpenMainModal = () => setModalOpen(true);
  const handleCloseMainModal = () => setModalOpen(false);

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

      <StoreTable />
      <ModalAddStore open={modalOpen} handleClose={handleCloseMainModal} />
    </div>
  );
};

import React, { useEffect, useState } from "react";
import WarehouseTable from "../../components/Table/WarehouseTable/WarehouseTable";
import ModalAddCoockies from "../../components/Modal/ModalAddCoockies/ModalAddCoockies";
import { useDispatch, useSelector } from "react-redux";
import { fetchCookies } from "../../Store/сookieSlice/cookieSlice";

export const WarehousePages = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const cookies = useSelector((state) => state.cookies.cookies);
  const token = useSelector((state) => state.auth.token);

  const handleOpenMainModal = () => setModalOpen(true);
  const handleCloseMainModal = () => setModalOpen(false);

  useEffect(() => {
    dispatch(fetchCookies(token));
  }, [token, dispatch]);

  return (
    <div className="page">
      <h1 className="title">Склад</h1>

      <div className="totalBlock">
        <h1 className="total">Количество товара: {cookies?.total}</h1>

        <button
          variant="contained"
          color="primary"
          className="addButton"
          onClick={handleOpenMainModal}
        >
          Добавить партию
        </button>
      </div>

      <WarehouseTable cookies={cookies} token={token} />
      <ModalAddCoockies open={modalOpen} handleClose={handleCloseMainModal} />
    </div>
  );
};

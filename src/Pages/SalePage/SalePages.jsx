import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalAddSale from "../../components/Modal/ModalAddSale/ModalAddSale";
import SaleTable from "../../components/Table/SaleTable/SaleTable";
import { fetchSale } from "../../Store/saleSlice/saleSlice";
import { fetchCookies } from "../../Store/сookieSlice/cookieSlice";
import { fetchStore } from "../../Store/storeSlice/storeSlice";

export const SalePages = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const stores = useSelector((state) => state.store.store);
  const sale = useSelector((state) => state.sale.sale);
  const cookies = useSelector((state) => state.cookies.cookies);
  const token = useSelector((state) => state.auth.token);

  const handleOpenMainModal = () => setModalOpen(true);
  const handleCloseMainModal = () => setModalOpen(false);

  useEffect(() => {
    dispatch(fetchCookies(token));
    dispatch(fetchStore(token));
    dispatch(fetchSale(token));
  }, [token, dispatch]);

  return (
    <div className="page">
      <h1 className="title">Продажи</h1>
      <div className="totalBlock">
        <h1 className="total">Количество: {sale.total}</h1>

        <button className="addButton" onClick={handleOpenMainModal}>
          Добавить
        </button>
      </div>
      <SaleTable sale={sale} token={token} />
      <ModalAddSale
        cookies={cookies}
        stores={stores}
        open={modalOpen}
        handleClose={handleCloseMainModal}
      />
    </div>
  );
};

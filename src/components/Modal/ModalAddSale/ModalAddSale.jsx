import React from "react";
import { useForm } from "react-hook-form";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchSale, postSale } from "../../../Store/saleSlice/saleSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

const ModalAddSale = ({ cookies, stores, open, handleClose }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(
        postSale({
          token,
          saleData: {
            cookie_id: parseInt(data.cookie_id),
            store_id: parseInt(data.store_id),
            quantity: data.quantity,
            date: data.date,
          },
        })
      ).unwrap();

      reset();
      handleClose();
      dispatch(fetchSale({ token, page: 1, pageSize: 10 }));
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(error);
    }
  };
  const today = new Date().toISOString().split("T")[0];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <h1 className="headText">Добавить новую партию</h1>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="formGroup select">
            <label htmlFor="cookie_id">Вид печенья (по кг):</label>
            <select
              id="cookie_id"
              {...register("cookie_id", {
                required: "Поле обязательна для заполнения",
              })}
            >
              {cookies &&
                cookies.data?.length > 0 &&
                cookies.data.map((cookie) => (
                  <option key={cookie.id} value={cookie.id}>
                    {cookie.name}
                  </option>
                ))}
            </select>
            {errors.cookie_id && (
              <p className="error">{errors.cookie_id.message}</p>
            )}
          </div>
          <div className="formGroup select">
            <label htmlFor="cookie_id">Название магазина:</label>
            <select
              id="store_id"
              {...register("store_id", {
                required: "Поле обязательна для заполнения",
              })}
            >
              {stores &&
                stores.data?.length > 0 &&
                stores.data.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
            </select>
            {errors.store_id && (
              <p className="error">{errors.store_id.message}</p>
            )}
          </div>

          <div className="formGroup">
            <label htmlFor="quantity">Количество:</label>
            <input
              type="number"
              id="quantity"
              {...register("quantity", {
                required: "Поле обязательна для заполнения",
                valueAsNumber: true,
              })}
            />
            {errors.quantity && (
              <p className="error">{errors.quantity.message}</p>
            )}
          </div>

          <div className="formGroup formGroupLast">
            <label htmlFor="date">Дата:</label>
            <input
              type="date"
              id="date"
              defaultValue={today}
              {...register("date", {
                required: "Поле обязательна для заполнения",
              })}
            />
            {errors.date && <p className="error">{errors.date.message}</p>}
          </div>
          {/* {saleStatus === "failed" && <p className="error">{saleError}</p>} */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 30,
            }}
          >
            <Button type="submit" variant="contained" color="primary">
              Добавить партию
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalAddSale;

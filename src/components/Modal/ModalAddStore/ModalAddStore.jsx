import React from "react";
import { useForm } from "react-hook-form";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchStore, postStore } from "../../../Store/storeSlice/storeSlice";

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

const ModalAddStore = ({ open, handleClose }) => {
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
        postStore({
          token,
          storeData: {
            name: data.name,
            address: data.address,
            contact: data.contact,
            phone_number: data.phone_number,
          },
        })
      ).unwrap();

      reset();
      handleClose();
      dispatch(fetchStore({ token, page: 1, pageSize: 10 }));
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <h1 className="headText">Добавить новый магазин</h1>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="formGroup">
            <label htmlFor="name">Название магазина:</label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: "Поле обязательна для заполнения",
              })}
            />
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>
          <div className="formGroup">
            <label htmlFor="address">Адрес:</label>
            <input
              type="text"
              id="address"
              {...register("address", {
                required: "Поле обязательна для заполнения",
              })}
            />
            {errors.address && (
              <p className="error">{errors.address.message}</p>
            )}
          </div>

          <div className="formGroup">
            <label htmlFor="contact">Контактное лицо:</label>
            <input
              type="text"
              id="contact"
              {...register("contact", {
                required: "Поле обязательна для заполнения",
              })}
            />
            {errors.contact && (
              <p className="error">{errors.contact.message}</p>
            )}
          </div>

          <div className="formGroup">
            <label htmlFor="phone_number">Номер телефона:</label>
            <input
              type="text"
              id="phone_number"
              {...register("phone_number", {
                required: "Поле обязательна для заполнения",
              })}
            />
            {errors.phone_number && (
              <p className="error">{errors.phone_number.message}</p>
            )}
          </div>
          <div className="formGroup formGroupLast">
            <label htmlFor="debt">Долг:</label>
            <input
              type="number"
              id="debt"
              {...register("debt", {
                required: "Поле обязательна для заполнения",
              })}
            />
            {errors.debt && <p className="error">{errors.debt.message}</p>}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 30,
            }}
          >
            <Button type="submit" variant="contained" color="primary">
              Добавить
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalAddStore;

import React from "react";
import { useForm } from "react-hook-form";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { fetchStore, postStore } from "../../../Store/storeSlice/storeSlice";
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
            debt: data.debt,
          },
        })
      ).unwrap();

      reset();
      handleClose();
      dispatch(fetchStore({ token, page: 1, pageSize: 10 }));
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(error);
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
            <TextField
              label="Название магазина"
              fullWidth
              {...register("name", {
                required: "Поле обязательна для заполнения",
              })}
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
            />
          </div>

          <div className="formGroup">
            <TextField
              label="Адрес"
              fullWidth
              {...register("address", {
                required: "Поле обязательна для заполнения",
              })}
              error={!!errors.address}
              helperText={errors.address ? errors.address.message : ""}
            />
          </div>

          <div className="formGroup">
            <TextField
              label="Контактное лицо"
              fullWidth
              {...register("contact", {
                required: "Поле обязательна для заполнения",
              })}
              error={!!errors.contact}
              helperText={errors.contact ? errors.contact.message : ""}
            />
          </div>

          <div className="formGroup">
            <TextField
              label="Номер телефона"
              fullWidth
              {...register("phone_number", {
                required: "Поле обязательна для заполнения",
              })}
              error={!!errors.phone_number}
              helperText={
                errors.phone_number ? errors.phone_number.message : ""
              }
            />
          </div>

          <div className="formGroup formGroupLast">
            <TextField
              label="Долг"
              type="number"
              fullWidth
              {...register("debt", {
                required: "Поле обязательна для заполнения",
              })}
              error={!!errors.debt}
              helperText={errors.debt ? errors.debt.message : ""}
            />
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

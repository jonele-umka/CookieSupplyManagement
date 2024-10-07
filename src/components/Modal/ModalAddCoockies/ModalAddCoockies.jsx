import React from "react";
import { useForm } from "react-hook-form";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField"; // Импортируйте TextField
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCookies,
  postCookie,
} from "../../../Store/сookieSlice/cookieSlice";
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

const ModalAddCoockies = ({ open, handleClose }) => {
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
        postCookie({
          token,
          cookieData: {
            name: data.name,
            price: String(data.price),
          },
        })
      ).unwrap();

      dispatch(fetchCookies({ token, page: 1, pageSize: 10 }));

      reset();
      handleClose();
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(error.message);
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
        <h1 className="headText">Добавить </h1>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="formGroup">
            <TextField
              label="Вид печенья (название)"
              id="name"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("name", {
                required: "Поле обязательна для заполнения",
              })}
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
            />
          </div>

          <div className="formGroup">
            <TextField
              label="Цена"
              id="price"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("price", {
                required: "Поле обязательна для заполнения",
                valueAsNumber: true,
              })}
              error={!!errors.price}
              helperText={errors.price ? errors.price.message : ""}
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

export default ModalAddCoockies;

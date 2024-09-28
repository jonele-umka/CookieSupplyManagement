import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";

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

const ModalPayments = ({ open, handleClose, storeId, token }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const sum = {
      store_id: storeId,
      ...data,
    };

    try {
      const response = await fetch("http://91.218.140.135:8080/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sum),
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      window.location.reload();
      handleClose();
      reset();
    } catch (error) {
      console.error("Ошибка при отправке оплаты:", error);
    }
  };
  const today = new Date().toISOString().split("T")[0];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="payment-modal-title"
      aria-describedby="payment-modal-description"
    >
      <Box sx={style}>
        <h1 className="headText">Оплатить</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="formGroup">
            <label htmlFor="price">Сумма:</label>
            <input
              type="number"
              id="price"
              {...register("price", {
                required: "Поле обязательна для заполнения",
              })}
            />
            {errors.price && <p className="error">{errors.price.message}</p>}
          </div>
          <div className="formGroup">
            <label htmlFor="date">Дата:</label>
            <input
              defaultValue={today}
              type="date"
              id="date"
              {...register("date", {
                required: "Поле обязательна для заполнения",
              })}
            />
            {errors.date && <p className="error">{errors.date.message}</p>}
          </div>

          <div
            style={{
              marginTop: 30,
            }}
          >
            <Button
              style={{ width: "100%" }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Оплатить
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalPayments;

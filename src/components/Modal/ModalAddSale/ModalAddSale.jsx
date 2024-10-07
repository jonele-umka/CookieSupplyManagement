import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchSale, postSale } from "../../../Store/saleSlice/saleSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

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

const ModalAddSale = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();
  const [cookies, setCookies] = useState(null);
  const [stores, setStores] = useState(null);

  const [selectedCookie, setSelectedCookie] = useState(null);

  useEffect(() => {
    const fetchCookies = async () => {
      try {
        const response = await fetch(`http://91.218.140.135:8080/api/cookie`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log(result);
        setCookies(result);
        return result;
      } catch (error) {
        console.error("Fetch sale error:", error.message);
        throw error;
      }
    };
    const fetchStore = async () => {
      try {
        const response = await fetch(`http://91.218.140.135:8080/api/store`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setStores(result);
        return result;
      } catch (error) {
        console.error("Fetch store error:", error.message);
        throw error;
      }
    };

    fetchCookies();
    fetchStore();
  }, []);

  useEffect(() => {
    if (cookies && cookies.data?.length > 0) {
      const firstCookie = cookies.data[0]; // Выбираем первое печенье
      setSelectedCookie(firstCookie); // Сохраняем весь объект печенья
      setValue("price_per_unit", firstCookie.price); // Устанавливаем цену
      setValue("cookie_id", firstCookie.id); // Устанавливаем id печенья
    }
  }, [cookies, setValue]); // Этот эффект вызывается после загрузки cookies

  useEffect(() => {
    // Убедитесь, что есть магазины
    if (stores && stores.data?.length > 0) {
      // Устанавливаем значение по умолчанию на ID первого магазина
      setValue("store_id", stores.data[0].id);
    }
  }, [stores, setValue]);

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
            price_per_unit: data.price_per_unit,
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
  // select
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleCookieChange = (event) => {
    const cookieId = parseInt(event.target.value);
    const selected = cookies.data.find((cookie) => cookie.id === cookieId); // Находим объект cookie

    if (selected) {
      setSelectedCookie(selected); // Сохраняем объект печенья
      setValue("price_per_unit", selected.price); // Устанавливаем цену
      setValue("cookie_id", selected.id); // Устанавливаем id печенья
    }
  };

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (open) {
      reset(); // Сброс формы при открытии
      clearErrors(); // Очистка ошибок валидации
    }
  }, [open, reset, clearErrors]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <h1 className="headText">Добавить</h1>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="cookie_id_label">Название печенья</InputLabel>
            <Select
              labelId="cookie_id_label"
              id="cookie_id"
              label="Название печенья"
              value={selectedCookie ? selectedCookie.id : ""} // Устанавливаем выбранное значение
              {...register("cookie_id", {
                required: "Поле обязательна для заполнения",
              })}
              onChange={handleCookieChange}
              MenuProps={MenuProps}
            >
              {cookies &&
                cookies.data?.length > 0 &&
                cookies.data.map((cookie) => (
                  <MenuItem key={cookie.id} value={cookie.id}>
                    {cookie.name}
                  </MenuItem>
                ))}
            </Select>
            {errors.cookie_id && (
              <p className="error">{errors.cookie_id.message}</p>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="store_id_label">Название магазина</InputLabel>
            <Select
              labelId="store_id_label"
              id="store_id"
              label="Название магазина"
              defaultValue={stores?.data.length > 0 ? stores?.data[0].id : ""} // Установите значение по умолчанию
              {...register("store_id", {
                required: "Поле обязательна для заполнения",
              })}
              onChange={(e) => setValue("store_id", e.target.value)}
              MenuProps={MenuProps}
            >
              {stores &&
                stores.data?.length > 0 &&
                stores.data.map((store) => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.name}
                  </MenuItem>
                ))}
            </Select>
            {errors.store_id && (
              <p className="error">{errors.store_id.message}</p>
            )}
          </FormControl>

          <TextField
            fullWidth
            id="price_per_unit"
            label="Цена за единицу"
            type="number"
            value={selectedCookie?.price || ""} // Проверяем, есть ли объект печенья, иначе пустая строка
            {...register("price_per_unit", {
              required: "Поле обязательна для заполнения",
              valueAsNumber: true,
            })}
            error={!!errors.price_per_unit}
            helperText={errors.price_per_unit?.message}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            id="quantity"
            label="Количество"
            type="number"
            {...register("quantity", {
              required: "Поле обязательна для заполнения",
              valueAsNumber: true,
            })}
            error={!!errors.quantity}
            helperText={errors.quantity?.message}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            id="date"
            label="Дата"
            type="date"
            defaultValue={today}
            {...register("date", {
              required: "Поле обязательна для заполнения",
            })}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.date}
            helperText={errors.date?.message}
            sx={{ mb: 2 }}
          />

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

export default ModalAddSale;

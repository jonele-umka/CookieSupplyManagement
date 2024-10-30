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
  Checkbox,
  ListItemText,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
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
    clearErrors,
  } = useForm();

  const [cookies, setCookies] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null); // Хранит выбранный магазин
  const [selectedCookies, setSelectedCookies] = useState([]); // Хранит выбранные печенья

  useEffect(() => {
    const fetchCookies = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/cookie`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setCookies(result.data || []);
      } catch (error) {
        console.error("Fetch cookie error:", error.message);
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
        setStores(result.data || []);
      } catch (error) {
        console.error("Fetch store error:", error.message);
      }
    };

    fetchCookies();
    fetchStore();
  }, [token]);

  const handleStoreChange = (event) => {
    setSelectedStore(event.target.value); // Устанавливаем выбранный магазин
  };

  const handleCookieChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCookies(value); // Устанавливаем выбранные печенья
  };

  const onSubmit = async (data) => {
    try {
      // Создаем массив с данными о продаже для каждого выбранного печенья
      const saleData = selectedCookies.map((cookieId) => ({
        cookie_id: parseInt(cookieId),
        store_id: parseInt(selectedStore), // Используем только один выбранный магазин
        quantity: data[`quantity_${cookieId}`] || 0,
        date: data.date,
        price_per_unit: data[`price_per_unit_${cookieId}`] || 0,
      }));

      await dispatch(postSale({ token, saleData })).unwrap();

      reset();
      handleClose();
      dispatch(fetchSale({ token, page: 1, pageSize: 10 }));
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(error.message);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (open) {
      reset(); // Сброс формы при открытии
      clearErrors(); // Очистка ошибок валидации
      setSelectedStore(null); // Сброс выбранного магазина
      setSelectedCookies([]); // Сброс выбранных печений
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
            <InputLabel id="store_id_label">Название магазина</InputLabel>
            <Select
              labelId="store_id_label"
              id="store_id"
              label="Название магазина"
              value={selectedStore || ""}
              onChange={handleStoreChange}
              MenuProps={{
                PaperProps: { style: { maxHeight: 48 * 4.5 + 8, width: 250 } },
              }}
            >
              {stores.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.name}
                </MenuItem>
              ))}
            </Select>
            {errors.store_id && (
              <p className="error">{errors.store_id.message}</p>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="cookie_id_label">Выбор печений</InputLabel>
            <Select
              labelId="cookie_id_label"
              id="cookie_id"
              label="Выбор печений"
              multiple
              value={selectedCookies}
              onChange={handleCookieChange}
              renderValue={(selected) => {
                const selectedNames = selected.map((id) => {
                  const cookie = cookies.find((c) => c.id === id);
                  return cookie ? cookie.name : "";
                });
                return selectedNames.join(", "); // Отображение названий выбранных печений
              }}
              MenuProps={{
                PaperProps: { style: { maxHeight: 48 * 4.5 + 8, width: 250 } },
              }}
            >
              {cookies.map((cookie) => (
                <MenuItem key={cookie.id} value={cookie.id}>
                  <Checkbox checked={selectedCookies.indexOf(cookie.id) > -1} />
                  <ListItemText primary={cookie.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedCookies && selectedCookies.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 10,
                flexDirection: "column",
                marginBottom: 20,
                height: 150,
                overflow: "auto",
                border: "1px solid #e8e8e8",
                borderRadius: 5,
              }}
            >
              {selectedCookies.map((cookieId) => {
                const cookie = cookies.find((cookie) => cookie.id === cookieId);
                return (
                  <div
                    key={cookieId}
                    style={{
                      border: "1px solid #e8e8e8",
                      display: "flex",
                      alignItems: "center",
                      padding: "10px",
                      gap: "10px",
                      borderRadius: 5,
                      background: "#f0f0f0",
                    }}
                  >
                    <p style={{ marginRight: "10px" }}>{cookie?.name}</p>

                    <input
                      type="number"
                      placeholder="Цена за единицу"
                      {...register(`price_per_unit_${cookieId}`, {
                        required: "Поле обязательна для заполнения",
                        valueAsNumber: true,
                      })}
                      defaultValue={cookie?.price} // Используем defaultValue вместо value
                      style={{
                        background: "#fff",
                        margin: 0,
                        padding: "10px 5px",
                        border: "1px solid",
                        borderColor: errors[`price_per_unit_${cookieId}`]
                          ? "red"
                          : "#ccc",
                      }}
                    />
                    {errors[`price_per_unit_${cookieId}`] && (
                      <span style={{ color: "red" }}>
                        {errors[`price_per_unit_${cookieId}`]?.message}
                      </span>
                    )}

                    <input
                      type="number"
                      placeholder="Количество"
                      {...register(`quantity_${cookieId}`, {
                        required: "Поле обязательна для заполнения",
                        valueAsNumber: true,
                      })}
                      style={{
                        background: "#fff",
                        margin: 0,
                        padding: "10px 5px",
                        border: "1px solid",
                        borderColor: errors[`quantity_${cookieId}`]
                          ? "red"
                          : "#ccc",
                      }}
                    />
                    {errors[`quantity_${cookieId}`] && (
                      <span style={{ color: "red" }}>
                        {errors[`quantity_${cookieId}`]?.message}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <TextField
            fullWidth
            id="date"
            label="Дата"
            type="date"
            defaultValue={today}
            {...register("date", {
              required: "Поле обязательна для заполнения",
            })}
            error={!!errors.date}
            helperText={errors.date?.message}
            sx={{ mb: 2 }}
          />

          <Button type="submit" variant="contained" color="primary">
            Добавить
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalAddSale;

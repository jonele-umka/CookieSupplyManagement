import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchCookies } from "../../Store/сookieSlice/cookieSlice";
import { fetchStore } from "../../Store/storeSlice/storeSlice";
import styles from "./Filter.module.css";

function Filter({ setStatisticsData }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const stores = useSelector((state) => state.store.store);
  const cookies = useSelector((state) => state.cookies.cookies);

  useEffect(() => {
    dispatch(fetchCookies(token));
    dispatch(fetchStore(token));
  }, [token, dispatch]);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      date_start: "",
      date_end: "",
      store_id: "",
      cookie_id: "",
    },
  });

  // Функция для получения даты полгода назад
  const getSixMonthsAgo = (date) => {
    const selectedDate = new Date(date);
    const sixMonthsAgo = new Date(
      selectedDate.setMonth(selectedDate.getMonth() - 6)
    );
    return sixMonthsAgo.toISOString().split("T")[0];
  };

  // Функция для получения текущей даты в формате YYYY-MM-DD
  const getToday = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Выполнение запроса и установка данных статистики
  const fetchStatistics = async (date_start, date_end, store_id, cookie_id) => {
    try {
      const response = await fetch(
        `http://91.218.140.135:8080/api/statistics/base_info?date_start=${date_start}&date_end=${date_end}&store_id=${store_id}&cookie_id=${cookie_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      const result = await response.json();
      setStatisticsData(result);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };
  // Устанавливаем начальные даты при загрузке компонента
  useEffect(() => {
    const today = getToday();
    const sixMonthsAgo = getSixMonthsAgo(today);
    setValue("date_end", today);
    setValue("date_start", sixMonthsAgo);
    fetchStatistics(sixMonthsAgo, today, "", ""); // начальная загрузка данных
  }, [setValue]);


  // Обработка отправки формы
  const onSubmit = (data) => {
    const { date_start, date_end, store_id, cookie_id } = data;
    fetchStatistics(date_start, date_end, store_id, cookie_id);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.filterDate}>
        <Controller
          name="date_start"
          control={control}
          rules={{ required: "Введите начальную дату" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Начальная дата"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!fieldState.error}
              helperText={fieldState.error ? fieldState.error.message : null}
              fullWidth
              margin="normal"
            />
          )}
        />

        <Controller
          name="date_end"
          control={control}
          rules={{ required: "Введите конечную дату" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Конечная дата"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!fieldState.error}
              helperText={fieldState.error ? fieldState.error.message : null}
              fullWidth
              margin="normal"
            />
          )}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="store-select-label">Выберите магазин</InputLabel>
          <Controller
            name="store_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="store-select-label"
                label="Выберите магазин"
              >
                <MenuItem value="">
                  <em>Все магазины</em>
                </MenuItem>
                {stores?.data?.map((store) => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="cookie-select-label">Выберите печенье</InputLabel>
          <Controller
            name="cookie_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="cookie-select-label"
                label="Выберите печенье"
              >
                <MenuItem value="">
                  <em>Все печенья</em>
                </MenuItem>
                {cookies?.data.map((cookie) => (
                  <MenuItem key={cookie.id} value={cookie.id}>
                    {cookie.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Загрузить статистику
        </Button>
      </div>
    </form>
  );
}

export default Filter;

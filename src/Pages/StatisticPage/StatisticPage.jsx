// Импортируйте useEffect и useState
import React, { useCallback, useEffect, useState } from "react";
import styles from "./StatisticPage.module.css";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import Chart from "../../components/Chart/Chart";
import ChartCookies from "../../components/Chart/ChartCookies";

function StatisticPage() {
  const token = useSelector((state) => state.auth.token);
  const [cookies, setCookies] = useState(null);
  const [stores, setStores] = useState(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await fetch(`http://91.218.140.135:8080/api/sale`, {
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
        console.log("result", result);
        setStores(result);
        return result;
      } catch (error) {
        console.error("Fetch store error:", error.message);
        throw error;
      }
    };
    fetchSale();
    fetchStore();
  }, []);

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      date_start: "",
      date_end: "",
      store_id: "",
      cookie_id: "",
    },
  });

  const [statisticsData, setStatisticsData] = useState(null);

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
  const fetchStatistics = useCallback(
    async (date_start, date_end, store_id, cookie_id) => {
      try {
        const response = await fetch(
          `http://91.218.140.135:8080/api/statistics/base_info?date_start=${date_start}&date_end=${date_end}&store_id=${
            store_id || ""
          }&cookie_id=${cookie_id}`,
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
    },
    [token]
  );

  useEffect(() => {
    const today = getToday();
    const sixMonthsAgo = getSixMonthsAgo(today);
    setValue("date_end", today);
    setValue("date_start", sixMonthsAgo);
    fetchStatistics(sixMonthsAgo, today, "", ""); // начальная загрузка данных
  }, [setValue, fetchStatistics]); // безопасно добавляем fetchStatistics в зависимости

  // Обработка отправки формы
  const onSubmit = (data) => {
    const { date_start, date_end, store_id, cookie_id } = data;
    fetchStatistics(date_start, date_end, store_id, cookie_id);
  };

  // Получаем значения начальной и конечной даты из формы
  const date_start = watch("date_start");
  const date_end = watch("date_end");
  const store_id = watch("store_id");

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
  return (
    <div>
      <div className={styles.filter}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.filterDate}>
            {/* Компоненты формы */}
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
                  helperText={
                    fieldState.error ? fieldState.error.message : null
                  }
                  fullWidth
                  margin="none"
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
                  helperText={
                    fieldState.error ? fieldState.error.message : null
                  }
                  fullWidth
                  margin="none"
                />
              )}
            />

            {/* Остальные элементы формы */}
            <FormControl fullWidth margin="none">
              <InputLabel id="store-select-label">Выберите магазин</InputLabel>
              <Controller
                name="store_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="store-select-label"
                    label="Выберите магазин"
                    MenuProps={MenuProps}
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

            <FormControl fullWidth margin="none">
              <InputLabel id="cookie-select-label">Выберите печенье</InputLabel>
              <Controller
                name="cookie_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="cookie-select-label"
                    label="Выберите печенье"
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="">
                      <em>Все печенья</em>
                    </MenuItem>
                    {cookies?.data.map((cookie) => (
                      <MenuItem key={cookie.cookie.id} value={cookie.cookie.id}>
                        {cookie.cookie.name}
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
      </div>
      <h1 className="title">Сводная информация</h1>
      <div className={styles.infoBlock}>
        <div className={styles.infoBox}>
          <h1>Общая сумма продаж</h1>
          {statisticsData && (
            <p>{statisticsData?.total_amount_of_payment} сом</p>
          )}
        </div>
        <div className={styles.infoBox}>
          <h1>Общая сумма оплат</h1>
          {statisticsData && <p>{statisticsData?.total_amount_of_sale} сом</p>}
        </div>
        <div className={styles.infoBox}>
          <h1>Текущая задолженность</h1>
          {statisticsData && <p>{statisticsData?.total_debt} сом</p>}
        </div>
      </div>
      {/* Передаем даты в компонент Chart */}
      <div style={{ marginBottom: 50 }}>
        <h1 className="title">Динамика продаж по времени</h1>
        <div style={{ marginTop: 30 }}>
          <Chart
            date_start={date_start}
            date_end={date_end}
            store_id={store_id}
          />
        </div>
      </div>
      <div style={{ marginBottom: 50 }}>
        <h1 className="title">Сравнение объемов продаж</h1>
        <div style={{ marginTop: 30 }}>
          <ChartCookies
            date_start={date_start}
            date_end={date_end}
            store_id={store_id}
          />
        </div>
      </div>
    </div>
  );
}

export default StatisticPage;

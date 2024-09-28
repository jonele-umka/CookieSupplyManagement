import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";

// Регистрируем компоненты для Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartCookies = ({ date_start, date_end, store_id }) => {
  const token = useSelector((state) => state.auth.token);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Количество проданных коробок",
        data: [],
        backgroundColor: "rgba(21, 122, 192, 0.6)",
      },
    ],
  });

  useEffect(() => {
    // Функция для получения данных с API
    const fetchSalesDataByCookie = async () => {
      try {
        const response = await fetch(
          `http://91.218.140.135:8080/api/statistics/sales_data_by_cookie?date_start=${date_start}&date_end=${date_end}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        const data = await response.json();

        // Обработка данных, предположим, что данные приходят в формате [{ cookie_name: 'Cookie A', total_sales: 150 }, ...]
        const labels = data.map((item) => item.cookie_name); // Названия видов печенья для оси X
        const salesData = data.map((item) => item.total_sales); // Количество продаж для оси Y

        // Обновляем данные диаграммы
        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Количество проданных коробок",
              data: salesData,
              backgroundColor: "rgba(21, 122, 192, 0.6)", // Задаем цвет
            },
          ],
        });
      } catch (error) {
        console.error("Ошибка при загрузке данных для диаграммы:", error);
      }
    };

    // Выполняем запрос только если параметры заданы
    if (date_start && date_end) {
      fetchSalesDataByCookie();
    }
  }, [date_start, date_end, store_id]);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      {" "}
      {/* Контейнер с шириной 100% и фиксированной высотой */}
      <Bar
        data={chartData}
        options={{
          responsive: true, // Диаграмма будет адаптироваться к размерам контейнера
          maintainAspectRatio: false, // Не сохранять фиксированное соотношение сторон
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Сравнение объема продаж по видам печенья",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Количество проданных коробок",
              },
            },
            x: {
              title: {
                display: true,
                text: "Виды печенья",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ChartCookies;

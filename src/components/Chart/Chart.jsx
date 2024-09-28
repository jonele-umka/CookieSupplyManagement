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

// Регистрируем необходимые компоненты для Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ date_start, date_end }) => {
  const token = useSelector((state) => state.auth.token);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Количество проданных коробок",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  useEffect(() => {
    // Функция для получения данных с API
    const fetchSalesData = async () => {
      try {
        const response = await fetch(
          `http://91.218.140.135:8080/api/statistics/sales_dynamics?date_start=${date_start}&date_end=${date_end}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        const labels = data.map((item) => item?.month);
        const salesData = data.map((item) => item?.total_sales);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Количество проданных коробок",
              data: salesData,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      } catch (error) {
        console.error("Ошибка при загрузке данных для диаграммы:", error);
      }
    };

    if (date_start && date_end) {
      fetchSalesData();
    }
  }, [date_start, date_end, token]);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false, // Отключить фиксированное соотношение сторон
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Продажи по месяцам",
            },
          },
        }}
      />
    </div>
  );
};

export default Chart;

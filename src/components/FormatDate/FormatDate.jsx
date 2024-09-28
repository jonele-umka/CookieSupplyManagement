// src/utils/formatDate.js
export const formatDate = (dateString) => {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  };

  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", options).replace(",", "");
};

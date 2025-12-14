// src/components/formatNumbersWIthDecimal.js
export const formatNumbersWithDecimal = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "0.00";
  return Number(num).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
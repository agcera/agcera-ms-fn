export const calculateTotal = (sale) => {
  let total = 0;
  sale.variations.forEach((variation) => {
    total += variation.quantity * variation.variation.sellingPrice;
  });
  return total;
};

export const calculateProfit = (sale) => {
  let totalSellingPrice = 0;
  sale.variations.forEach((variation) => {
    totalSellingPrice += variation.quantity * variation.variation.sellingPrice;
  });
  let totalCostPrice = 0;
  sale.variations.forEach((variation) => {
    totalCostPrice += variation.quantity * variation.variation.costPrice;
  });
  return totalSellingPrice - totalCostPrice;
};

export const calculateTotal = (sale) => {
  let total = 0;
  sale.variations.forEach((variation) => {
    total += variation.quantity * variation.variation.sellingPrice;
  });
  (sale.mixtures || []).forEach((mixture) => {
    total += mixture.quantity * mixture.mixture.sellingPrice;
  });
  return total;
};

export const calculateProfit = (sale) => {
  let totalSellingPrice = 0;
  sale.variations.forEach((variation) => {
    totalSellingPrice += variation.quantity * variation.variation.sellingPrice;
  });
  (sale.mixtures || []).forEach((mixture) => {
    totalSellingPrice += mixture.quantity * mixture.mixture.sellingPrice;
  });
  let totalCostPrice = 0;
  sale.variations.forEach((variation) => {
    totalCostPrice += variation.quantity * variation.variation.costPrice;
  });
  (sale.mixtures || []).forEach((mixture) => {
    totalCostPrice += mixture.quantity * mixture.mixture.costPrice;
  });
  return totalSellingPrice - totalCostPrice;
};

export const calculateTotal = (sale) => {
  let total = 0;
  sale.variations.forEach((variation) => {
    total += variation.quantity * variation.variation.sellingPrice;
  });
  (sale.combos || []).forEach((combo) => {
    total += combo.quantity * combo.combo.sellingPrice;
  });
  return total;
};

export const calculateProfit = (sale) => {
  let totalSellingPrice = 0;
  sale.variations.forEach((variation) => {
    totalSellingPrice += variation.quantity * variation.variation.sellingPrice;
  });
  (sale.combos || []).forEach((combo) => {
    totalSellingPrice += combo.quantity * combo.combo.sellingPrice;
  });
  let totalCostPrice = 0;
  sale.variations.forEach((variation) => {
    totalCostPrice += variation.quantity * variation.variation.costPrice;
  });
  (sale.combos || []).forEach((combo) => {
    totalCostPrice += combo.quantity * combo.combo.costPrice;
  });
  return totalSellingPrice - totalCostPrice;
};

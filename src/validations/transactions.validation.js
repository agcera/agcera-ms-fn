import yup from '.';

export const createTransactionSchema = yup.object({
  type: yup.string().oneOf(['INCOME', 'EXPENSE']).required(),
  amount: yup.number().min(0).required(),
  description: yup.string().required(),
  paymentMethod: yup.string().oneOf(['M-PESA', 'E-MOLA', 'P.O.S', 'BANCO BIM', 'BANCO BCI', 'CASH']).required(),
});

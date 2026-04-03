import yup from '.';
import { paymentMethodsEnum } from '../constants/sales.constant';

export const createTransactionSchema = yup.object({
  type: yup.string().oneOf(['INCOME', 'EXPENSE']).required(),
  amount: yup.number().min(0).required(),
  description: yup.string().required(),
  paymentMethod: yup.string().oneOf(paymentMethodsEnum).required(),
});

import yup from '.';
import { paymentMethodsEnum } from '../constants/sales.constant';

export const createSaleSchema = yup
  .object({
    storeId: yup.string().required(),
    // variations: yup.object().pattern(yup.string().required(), yup.number().integer().required()).min(1).required(),
    variations: yup.object(),
    mixtures: yup.object(),
    payments: yup
      .array()
      .of(
        yup.object({
          paymentMethod: yup.string().oneOf(paymentMethodsEnum).required(),
          amount: yup.number().moreThan(0, 'Payment amount must be greater than 0').required(),
        })
      )
      .uniqueField('paymentMethod', 'Each payment method can only be used once')
      .min(1, 'Please provide payment(s) for this sale')
      .required(),
    clientName: yup.string().required(),
    phone: yup
      .string()
      .matches(/^\+\d{12}$/, {
        message: 'Invalid phone number, a phone number should start with + and be 12 digits',
      })
      .required(),
    isMember: yup.boolean().default(false),
    doneOn: yup.date().nullable(),
  })
  .test(
    'products-or-mixtures',
    'Please select at least one product or mixture',
    (value) =>
      (value?.variations && Object.keys(value.variations).length > 0) ||
      (value?.mixtures && Object.keys(value.mixtures).length > 0)
  );

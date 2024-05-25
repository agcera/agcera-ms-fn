import yup from '.';

export const createSaleSchema = yup.object({
  storeId: yup.string().required(),
  // variations: yup.object().pattern(yup.string().required(), yup.number().integer().required()).min(1).required(),
  variations: yup.object().required(),
  paymentMethod: yup.string().oneOf(['M-PESA', 'E-MOLA', 'P.O.S', 'BANCO BIM', 'BANCO BCI', 'CASH']).required(),
  clientName: yup.string().required(),
  phone: yup
    .string()
    .matches(/^\+\d{12}$/, {
      message: 'Invalid phone number, a phone number should start with + and be 12 digits',
    })
    .required(),
  isMember: yup.boolean().default(false),
});

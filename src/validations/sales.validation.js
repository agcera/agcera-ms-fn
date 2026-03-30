import yup from '.';

export const createSaleSchema = yup
  .object({
    storeId: yup.string().required(),
    // variations: yup.object().pattern(yup.string().required(), yup.number().integer().required()).min(1).required(),
    variations: yup.object(),
    mixtures: yup.object(),
    paymentMethod: yup.string().oneOf(['M-PESA', 'E-MOLA', 'P.O.S', 'BANCO BIM', 'BANCO BCI', 'CASH']).required(),
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

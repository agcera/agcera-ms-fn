import yup from '.';

export const createSaleSchema = yup.object({
  storeId: yup.string().required(),
  // variations: yup.object().pattern(yup.string().required(), yup.number().integer().required()).min(1).required(),
  variations: yup.object().required(),
  paymentMethod: yup.string().oneOf(['CASH', 'MOMO']).required(),
  clientType: yup.string().oneOf(['USER', 'CLIENT']).required(),
  clientId: yup.string().when('clientType', {
    is: 'USER',
    then: () => yup.string().required(),
    otherwise: () =>
      yup
        .string()
        .matches(/^\+\d{12}$/, {
          message: 'Invalid phone number, a phone number should start with + and be 12 digits',
        })
        .required(),
  }),
});

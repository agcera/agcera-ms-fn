import yup from '.';

export const createStoreSchema = yup.object({
  name: yup.string().required(),
  location: yup.string().required(),
  phone: yup
    .string()
    .matches(/^\+\d{12}$/, { message: 'Invalid phone number, a phone number should start with + and be 12 digits' })
    .required(),
  isActive: yup.boolean().typeError('status should be a boolean type').required('status is a required field'),
  keepers: yup.array().of(yup.string()).unique('Keepers must be unique').min(1).required(),
});

export const updateStoreSchema = yup.object({
  // name: yup.string(),
  location: yup.string(),
  phone: yup
    .string()
    .matches(/^\+\d{12}$/, { message: 'Invalid phone number, a phone number should start with + and be 12 digits' }),
  isActive: yup.boolean().typeError('status should be a boolean type'),
  // keepers: yup.array().of(yup.string()).unique('Keepers must be unique').min(1),
});

export const storeAddMoveProductSchema = yup.object({
  from: yup.string().nullable(),
  to: yup
    .string()
    .not([yup.ref('from')])
    .required(),
  productId: yup.string().required(),
  quantity: yup.number().integer().min(1).max(yup.ref('fromQuantity')).required(),
});

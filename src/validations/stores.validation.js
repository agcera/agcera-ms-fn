import * as yup from 'yup';

export const createStoreSchema = yup.object({
  name: yup.string().required(),
  location: yup.string().required(),
  phone: yup
    .string()
    .matches(/^\+\d{12}$/, { message: 'Invalid phone number, a phone number should start with + and be 12 digits' })
    .required(),
  isActive: yup.boolean().typeError('status should be a boolean type').required('status is a required field'),
});

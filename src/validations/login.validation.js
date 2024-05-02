import * as yup from 'yup';

export const loginFormSchema = yup.object({
  phone: yup
    .string()
    .matches(/^\+\d{12}$/, { message: 'Invalid phone number, a phone number should start with + and be 12 digits' })
    .required(),
  password: yup.string().min(4).required(),
});

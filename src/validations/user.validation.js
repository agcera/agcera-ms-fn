import yup from '.';

export const loginFormSchema = yup.object({
  phone: yup
    .string()
    .matches(/^\+\d{12}$/, { message: 'Invalid phone number, a phone number should start with + and be 12 digits' })
    .required(),
  password: yup.string().min(4).required(),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email().required(),
});

export const resetPasswordSchema = yup.object({
  newPassword: yup.string().min(4).required(),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required(),
});

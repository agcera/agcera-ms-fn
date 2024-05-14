import yup from '.';

export const registerFormSchema = yup.object({
  storeId: yup.string().required(),
  name: yup.string().required(),
  phone: yup
    .string()
    .matches(/^\+\d{12}$/, { message: 'Invalid phone number, a phone number should start with + and be 12 digits' })
    .required(),
  email: yup.string().email(),
  password: yup.string().min(4).required(),
  location: yup.string(),
  gender: yup.string().oneOf(['MALE', 'FEMALE', 'UNSPECIFIED']),
  role: yup.string().oneOf(['user', 'keeper', 'admin']).nullable(),
});

export const updateUserSchema = yup.object({
  storeId: yup.string(),
  name: yup.string(),
  phone: yup
    .string()
    .matches(/^\+\d{12}$/, { message: 'Invalid phone number, a phone number should start with + and be 12 digits' }),
  email: yup.string().email(),
  location: yup.string(),
  gender: yup.string().oneOf(['MALE', 'FEMALE', 'UNSPECIFIED']),
});

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

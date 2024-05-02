import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Typography } from '@mui/material';
import { Form, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { loginAction } from '../../redux/users/userSlice';
import { loginFormSchema } from '../../validations/login.validation';
import Input from '../Input';
import LoadingButton from '../LoadingButton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const StyledTextField = ({ ...props }) => {
  return <Input className="max-w-[450px]" {...props} />;
};

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const onSubmit = (data) => {
    dispatch(loginAction(data)).then(({ payload, error }) => {
      if (payload) {
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(error.message);
      }
    });
  };

  return (
    <Form id="login" control={control} action="" method="post" onSubmit={handleSubmit(onSubmit)}>
      <Box className="flex flex-col gap-4 items-center">
        <StyledTextField
          label="Phone number"
          placeHolder="Enter your phone number..."
          error={!!errors.phone}
          helperText={errors.phone?.message}
          inputProps={{ ...register('phone') }}
        />
        <StyledTextField
          label="Password"
          placeHolder="Enter Password..."
          error={!!errors.password}
          helperText={errors.password?.message}
          inputProps={{ ...register('password') }}
        />

        <Stack direction="row-reverse" className="max-w-[450px] w-full">
          <Typography variant="info1" color="primary.light">
            forgot password? click here
          </Typography>
        </Stack>

        <LoadingButton variant="contained" color="specialBlue" className="max-w-[450px] w-full" type="submit">
          Login
        </LoadingButton>
      </Box>
    </Form>
  );
};

export default LoginForm;

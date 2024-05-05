import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Typography } from '@mui/material';
import { Form, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { loginAction } from '../../redux/usersSlice';
import { loginFormSchema } from '../../validations/user.validation';
import Input from '../Input';
import LoadingButton from '../LoadingButton';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';

const StyledTextField = ({ ...props }) => {
  return <Input className="max-w-[450px]" {...props} />;
};

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    dispatch(loginAction(data)).then(({ payload, error }) => {
      setLoading(false);
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
          disabled={loading}
          inputProps={{ ...register('phone') }}
        />
        <StyledTextField
          label="Password"
          placeHolder="Enter Password..."
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={loading}
          inputProps={{ ...register('password') }}
        />

        <Stack direction="row-reverse" className="max-w-[450px] w-full">
          <Typography
            component={Link}
            to={!loading && '/forgot-password'}
            variant="info1"
            color="primary.light"
            className="hover:text-primary"
          >
            forgot your password? click here
          </Typography>
        </Stack>

        <LoadingButton
          variant="contained"
          color="specialBlue"
          className="max-w-[450px] w-full"
          type="submit"
          loading={loading}
        >
          Login
        </LoadingButton>
      </Box>
    </Form>
  );
};

export default LoginForm;

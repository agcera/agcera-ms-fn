import { Box, Button, Container, Typography } from '@mui/material';
import HeaderUnderline from '../../global/HeaderUnderline';
import Input from '../../components/Input';
import { Form, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '../../validations/user.validation';
import LoadingButton from '../../components/LoadingButton';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { forgotPasswordAction } from '../../redux/usersSlice';
import { toast } from 'react-toastify';
import { useState } from 'react';

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      phone: '',
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    dispatch(forgotPasswordAction(data)).then(({ payload, error }) => {
      setLoading(false);
      if (payload) {
        toast.success(payload.message);
      } else {
        toast.error(error.message);
      }
    });
  };

  return (
    <Container className="w-full h-full flex" maxWidth="xl">
      <Box className="w-full m-auto px-4 sm:px-8 py-8">
        <Box className="max-w-[200px] w-full m-auto mb-8">
          <img src="/images/logo_cropped.png" alt="logo" className="w-full" />
        </Box>

        <Box className="w-full flex flex-col items-center mb-6">
          <Typography variant="header" className="text-center font-semibold text-dark mb-2">
            Change Password
          </Typography>
          <HeaderUnderline className="m-auto" />
        </Box>

        <Form
          id="login"
          control={control}
          action=""
          method="post"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4 items-center"
        >
          <Input
            disabled={loading}
            label="Phone"
            placeHolder="Enter phone number..."
            className="max-w-[450px]"
            error={!!errors.phone}
            helperText={errors.phone?.message}
            inputProps={{
              ...register('phone'),
            }}
          />

          <Box className="max-w-[450px] w-full flex flex-col gap-2">
            <LoadingButton variant="contained" color="specialBlue" className="w-full" type="submit" loading={loading}>
              Reset Password
            </LoadingButton>
            <Button
              LinkComponent={Link}
              to={'/login'}
              variant="contained"
              color="secondary"
              className="w-full"
              disabled={loading}
            >
              Back to login
            </Button>
          </Box>
        </Form>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;

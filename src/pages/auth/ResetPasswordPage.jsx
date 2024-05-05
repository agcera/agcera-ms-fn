import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Container, Typography } from '@mui/material';
import { useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../../components/Input';
import LoadingButton from '../../components/LoadingButton';
import HeaderUnderline from '../../global/HeaderUnderline';
import { resetPasswordAction } from '../../redux/usersSlice';
import { resetPasswordSchema } from '../../validations/user.validation';

const StyledTextField = ({ ...props }) => {
  return <Input className="max-w-[450px]" {...props} />;
};

const ResetPasswordPage = () => {
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    dispatch(resetPasswordAction({ password: data.newPassword, token: routeParams.token })).then(
      ({ payload, error }) => {
        setLoading(false);
        if (payload) {
          toast.success(payload.message);
          navigate('/login');
        } else {
          toast.error(error.message);
        }
      }
    );
  };

  return (
    <Container className="w-full h-full flex" maxWidth="xl">
      <Box className="w-full m-auto px-4 sm:px-8 py-8">
        <Box className="max-w-[200px] w-full m-auto mb-8">
          <img src="/images/logo_cropped.png" alt="logo" className="w-full" />
        </Box>

        <Box className="w-full flex flex-col items-center mb-6">
          <Typography variant="header" className="text-center font-semibold text-dark mb-2">
            Reset Password
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
          <StyledTextField
            disabled={loading}
            label="New Password"
            placeHolder="Enter your new password..."
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            inputProps={{
              type: 'password',
              ...register('newPassword'),
            }}
          />
          <StyledTextField
            disabled={loading}
            label="Confirm new password"
            placeHolder="Enter your new password..."
            error={!!errors.confirmNewPassword}
            helperText={errors.confirmNewPassword?.message}
            inputProps={{
              type: 'password',
              ...register('confirmNewPassword'),
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
              Go to login
            </Button>
          </Box>
        </Form>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;

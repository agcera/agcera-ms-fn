import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, MenuItem, Typography, capitalize } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, Form, useForm } from 'react-hook-form';
import { PiUploadFill } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllPartialStoresAction, selectAllStores } from '../../redux/storesSlice';
import { registerAction } from '../../redux/usersSlice';
import { registerFormSchema } from '../../validations/user.validation';
import Input from '../Input';
import LoadingButton from '../LoadingButton';
import Select from '../Select';

const StyledTextField = ({ ...props }) => {
  return <Input className="max-w-[450px]" {...props} />;
};

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stores = useSelector(selectAllStores);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      password: '',
      storeId: '',
      email: '',
      location: '',
      gender: 'UNSPECIFIED',
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    dispatch(registerAction({ ...data, image })).then(({ payload, error }) => {
      setLoading(false);
      if (payload) {
        toast.success('Registered successfully; proceed to logging in');
        navigate('/login');
      } else {
        toast.error(error.message);
      }
    });
  };

  useEffect(() => {
    dispatch(getAllPartialStoresAction()).then(({ error }) => {
      if (error) toast.error(error.message);
    });
  }, [dispatch]);

  return (
    <Form id="register" control={control} action="" method="post" onSubmit={handleSubmit(onSubmit)}>
      <Box className="flex flex-col gap-2 items-center">
        <StyledTextField
          label="Name"
          placeHolder="Enter your name..."
          error={!!errors.name}
          helperText={errors.name?.message}
          disabled={loading}
          inputProps={{ ...register('name') }}
        />
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
        <Controller
          name="storeId"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <Select
                className="max-w-[450px]"
                label="Store"
                disabled={loading}
                error={!!error}
                helperText={error?.message}
                inputProps={{ ...field }}
              >
                {!stores?.length && (
                  <MenuItem value={null} disabled={true}>
                    Loading...
                  </MenuItem>
                )}
                {stores?.map((store) => {
                  return (
                    <MenuItem key={store.id} value={store.id}>
                      {capitalize(store.name)}
                    </MenuItem>
                  );
                })}
              </Select>
            );
          }}
        />
        <StyledTextField
          label="Email"
          placeHolder="Enter your email..."
          required={false}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={loading}
          inputProps={{ ...register('email') }}
        />
        <StyledTextField
          label="Location"
          placeHolder="Enter your location..."
          required={false}
          error={!!errors.location}
          helperText={errors.location?.message}
          disabled={loading}
          inputProps={{ ...register('location') }}
        />
        <Controller
          name="gender"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <Select
                className="max-w-[450px]"
                label="Gender"
                required={false}
                disabled={loading}
                error={!!error}
                helperText={error?.message}
                inputProps={{ ...field }}
              >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="UNSPECIFIED">Unspecified</MenuItem>
              </Select>
            );
          }}
        />

        <Box className="flex flex-col gap-2 w-full max-w-[450px]">
          {/* <Typography variant="subHeader" component="label" htmlFor="image" className="font-medium">
            Avatar <span className="text-secondary"> *</span>
          </Typography> */}
          <Input
            label="Avatar"
            disabled={loading}
            inputProps={{
              type: 'file',
              accept: 'image/*',
              className: 'w-full max-w-[450px]',
              classes: { input: 'h-[50px]' },
              name: 'image',
              id: 'image',
              onChange: (e) => setImage(e.target.files[0]),
              inputProps: { accept: 'image/*' },
            }}
          />
          {!image ? (
            <Box
              component="label"
              htmlFor="image"
              className="flex flex-col justify-center items-center border border-dashed rounded-md p-2 max-w-[500px] w-full h-full aspect-[2/1] cursor-pointer hover:bg-light-blue-50/50"
            >
              <PiUploadFill size={40} />
              <Typography variant="subHeader" color="secondary.light" className="text-center font-medium">
                Click to upload image
              </Typography>
            </Box>
          ) : (
            <img
              src={URL.createObjectURL(image)}
              alt="avatar"
              className="max-w-[500px] w-full h-full aspect-[2/1] object-cover border border-dashed rounded-md p-2"
            />
          )}
        </Box>

        <LoadingButton
          variant="contained"
          color="specialBlue"
          className="max-w-[450px] w-full mt-4"
          type="submit"
          loading={loading}
          disabled={!image}
        >
          Register
        </LoadingButton>
        <Button
          LinkComponent={Link}
          to="/login"
          color="secondary"
          className="max-w-[450px] w-full mt-4"
          disabled={loading}
        >
          Got to login
        </Button>
      </Box>
    </Form>
  );
};

export default RegisterForm;

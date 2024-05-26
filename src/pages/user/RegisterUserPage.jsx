import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, MenuItem, Typography, capitalize } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, Form, useForm } from 'react-hook-form';
import { PiUploadFill } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../../components/Input';
import LoadingButton from '../../components/LoadingButton';
import PageHeader from '../../components/PageHeader';
import Select from '../../components/Select';
import { getAllPartialStoresAction, getAllStoresAction, selectAllStores } from '../../redux/storesSlice';
import { registerAction, selectLoggedInUser } from '../../redux/usersSlice';
import { registerFormSchema } from '../../validations/user.validation';

const RegisterUserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectLoggedInUser);
  const stores = useSelector(selectAllStores);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
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
      role: 'keeper',
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    dispatch(registerAction({ ...data, image })).then(({ payload, error }) => {
      setLoading(false);
      if (payload) {
        navigate('/dashboard/users');
      } else {
        toast.error(error.message);
      }
    });
  };

  useEffect(() => {
    dispatch(user.role === 'admin' ? getAllStoresAction() : getAllPartialStoresAction()).then(({ error }) => {
      if (error) toast.error(error.message);
    });
  }, [dispatch, user]);

  return (
    <Form control={control} method="post" action="" onSubmit={handleSubmit(onSubmit)}>
      <PageHeader title="Register user" hasBack={true} backTo="/dashboard/users" />
      <Grid container className="px-4 py-2" rowSpacing={0.5} columnSpacing={2}>
        <Grid item xs={12} sm={6}>
          <Input
            label="Name"
            placeHolder="Enter your name..."
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={loading}
            inputProps={{ ...register('name') }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            label="Phone number"
            placeHolder="Enter your phone number..."
            error={!!errors.phone}
            helperText={errors.phone?.message}
            disabled={loading}
            inputProps={{ ...register('phone') }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="role"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <Select
                  label="Role"
                  required={false}
                  disabled={loading}
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{ ...field }}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="keeper">Keeper</MenuItem>
                  {/* <MenuItem value="user">User</MenuItem> */}
                </Select>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            label="Password"
            placeHolder="Enter Password..."
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={loading}
            inputProps={{ ...register('password') }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="storeId"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <Select
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            label="Email"
            placeHolder="Enter your email..."
            required={false}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={loading}
            inputProps={{ ...register('email') }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            label="Location"
            placeHolder="Enter your location..."
            required={false}
            error={!!errors.location}
            helperText={errors.location?.message}
            disabled={loading}
            inputProps={{ ...register('location') }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="gender"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <Select
                  label="Gender"
                  disabled={loading}
                  required={false}
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
        </Grid>
      </Grid>

      <Box className="flex flex-col gap-2 w-full max-w-[500px] px-4">
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
      <Box className="p-4 flex justify-end gap-2">
        <LoadingButton loading={loading} disabled={!image} type="submit" className="w-full max-w-[175px]">
          Register
        </LoadingButton>
        <Button
          LinkComponent={Link}
          to="/dashboard/users"
          disabled={loading}
          color="secondary"
          className="w-full max-w-[175px]"
        >
          Cancel
        </Button>
      </Box>
    </Form>
  );
};

export default RegisterUserPage;

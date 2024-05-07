import { Box, Button, Grid, MenuItem, Stack, Typography } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { Controller, Form, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createStoreSchema } from '../../validations/stores.validation';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreAction, selectStoreById, updateStoreAction } from '../../redux/storesSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import LoadingButton from '../../components/LoadingButton';
import Loader from '../../components/Loader';

const UpdateStorePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeParams = useParams();
  const store = useSelector(selectStoreById(routeParams.id));
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createStoreSchema),
    defaultValues: {
      name: '',
      location: '',
      phone: '',
      isActive: true,
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    dispatch(updateStoreAction({ id: routeParams.id, data })).then(({ payload, error }) => {
      setLoading(false);
      if (payload) {
        navigate(`/dashboard/stores/${routeParams.id}`);
      } else {
        toast.error(error.message);
      }
    });
  };

  useEffect(() => {
    dispatch(getStoreAction(routeParams.id)).then(({ error }) => {
      setInitLoading(false);
      if (error) {
        toast.error(error.message);
      }
    });
  }, [dispatch, routeParams.id]);
  useEffect(() => {
    if (store) {
      setValue('name', store.name);
      setValue('location', store.location);
      setValue('phone', store.phone);
      setValue('isActive', store.isActive || '');
    }
  }, [setValue, store]);

  if (!store && initLoading) {
    return (
      <Box className="w-full h-full flex">
        <Loader className="m-auto" />
      </Box>
    );
  }

  if (!store) {
    return (
      <Box className="w-full h-full">
        <PageHeader title={`Update store`} hasBack={true} backTo="/dashboard/stores" />
        <Box className="w-full h-full flex">
          <Typography className="text-center m-auto" color="secondary.light">
            Store not found
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Form control={control} action="" method="post" onSubmit={handleSubmit(onSubmit)}>
      <Box className="w-full overflow-y-auto">
        <PageHeader title={`Update ${store.name} details`} hasBack={true} backTo="/dashboard/stores" />
        <Box className="px-4 py-2">
          <Grid container rowSpacing={1} columnSpacing={2} className="mb-4">
            <Grid item xs={12}>
              <Input
                label="Store name"
                placeHolder="Enter store name..."
                disabled={loading}
                required={false}
                error={!!errors.name}
                helperText={errors.name?.message}
                inputProps={{ ...register('name') }}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                label="Location"
                placeHolder="Enter store location..."
                disabled={loading}
                required={false}
                error={!!errors.location}
                helperText={errors.location?.message}
                inputProps={{ ...register('location') }}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                label="Phone number"
                placeHolder="Enter store phone number..."
                disabled={loading}
                required={false}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                inputProps={{ ...register('phone') }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                disabled={loading}
                control={control}
                name="isActive"
                render={({ field, fieldState: { error } }) => {
                  return (
                    <Select
                      label="Status"
                      required={false}
                      error={!!error}
                      helperText={errors.message}
                      inputProps={{ ...field }}
                    >
                      <MenuItem value={true}>Active</MenuItem>
                      <MenuItem value={false}>InActive</MenuItem>
                    </Select>
                  );
                }}
              />
            </Grid>
          </Grid>

          <Stack direction="row-reverse" gap={2} className="mb-2">
            <Button
              LinkComponent={Link}
              to="/dashboard/stores"
              color="secondary"
              className="max-w-[175px] w-full"
              disabled={loading}
            >
              Cancel
            </Button>
            <LoadingButton loading={loading} className="max-w-[175px] w-full" type="submit">
              Update store
            </LoadingButton>
          </Stack>
        </Box>
      </Box>
    </Form>
  );
};

export default UpdateStorePage;

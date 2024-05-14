import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, MenuItem, Stack, Typography } from '@mui/material';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Controller, Form, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../../components/Input';
import Loader from '../../components/Loader';
import LoadingButton from '../../components/LoadingButton';
import MultiSelect from '../../components/MultiSelect';
import PageHeader from '../../components/PageHeader';
import Select from '../../components/Select';
import { getStoreAction, selectStoreById, updateStoreAction } from '../../redux/storesSlice';
import { getAllUsersAction, selectAllUsersByRole } from '../../redux/usersSlice';
import { updateStoreSchema } from '../../validations/stores.validation';

const UpdateStorePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeParams = useParams();
  const store = useSelector(selectStoreById(routeParams.id));
  const keepers = useSelector(selectAllUsersByRole(['keeper']));
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const {
    control,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateStoreSchema),
  });

  const storeKeepers = useMemo(() => {
    const storeKeepers = keepers?.filter((u) => u.storeId === store?.id);
    if (storeKeepers?.length > 0) return storeKeepers;
    return null;
  }, [keepers, store]);
  const isMainStore = store?.name === 'main';

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
    Promise.all([dispatch(getStoreAction(routeParams.id)), dispatch(getAllUsersAction({ role: ['keeper'] }))]).then(
      (resp) => {
        setInitLoading(false);
        resp.forEach(({ error }) => {
          if (error) toast.error(error.message);
        });
      }
    );
  }, [dispatch, routeParams.id]);
  useLayoutEffect(() => {
    const { name, location, phone, isActive = null, keepers } = getValues();
    if (store) {
      !name && !isMainStore && setValue('name', store.name);
      !location && setValue('location', store.location);
      !phone && setValue('phone', store.phone);
      isActive === null && setValue('isActive', store.isActive || false);
    }
    if (storeKeepers) {
      !keepers &&
        !isMainStore &&
        setValue(
          'keepers',
          storeKeepers.map((u) => u.id)
        );
    }
  }, [store, storeKeepers, isMainStore, setValue, getValues]);

  if (!store || !keepers?.length || initLoading) {
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
        <PageHeader title={`Update ${store.name} details`} hasBack={true} />
        <Box className="px-4 py-2">
          <Grid container rowSpacing={1} columnSpacing={2} className="mb-4">
            {!isMainStore && (
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
            )}
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
                defaultValue={true}
                disabled={loading}
                control={control}
                name="isActive"
                render={({ field, fieldState: { error } }) => {
                  return (
                    <Select
                      label="Status"
                      required={false}
                      error={!!error}
                      helperText={error?.message}
                      inputProps={{ ...field }}
                    >
                      <MenuItem value={true}>Active</MenuItem>
                      <MenuItem value={false}>InActive</MenuItem>
                    </Select>
                  );
                }}
              />
            </Grid>
            {!isMainStore && (
              <Grid item xs={12}>
                <Controller
                  defaultValue={[]}
                  disabled={loading}
                  control={control}
                  name="keepers"
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <MultiSelect
                        options={keepers.map((u) => ({ value: u.id, name: u.name }))}
                        label="Store keepers"
                        required={false}
                        error={!!error}
                        helperText={error?.message}
                        inputProps={{ ...field }}
                      />
                    );
                  }}
                />
              </Grid>
            )}
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

import { Box, Button, Grid, MenuItem, Stack } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { Controller, Form, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createStoreSchema } from '../../validations/stores.validation';
import { useDispatch } from 'react-redux';
import { registerStoreAction } from '../../redux/storesSlice';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';
import LoadingButton from '../../components/LoadingButton';

const CreateStorePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
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
    dispatch(registerStoreAction(data)).then(({ payload, error }) => {
      setLoading(false);
      if (payload) {
        navigate('/dashboard/stores');
      } else {
        toast.error(error.message);
      }
    });
  };

  return (
    <Form control={control} action="" method="post" onSubmit={handleSubmit(onSubmit)}>
      <Box className="w-full overflow-y-auto">
        <PageHeader title="Register new store" hasBack={true} backTo="/dashboard/stores" />
        <Box className="px-4 py-2">
          <Grid container rowSpacing={1} columnSpacing={2} className="mb-4">
            <Grid item xs={12}>
              <Input
                label="Store name"
                placeHolder="Enter store name..."
                disabled={loading}
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
              Register store
            </LoadingButton>
          </Stack>
        </Box>
      </Box>
    </Form>
  );
};

export default CreateStorePage;

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Checkbox, FormControlLabel, Grid, MenuItem, Stack } from '@mui/material';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Controller, Form, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../../components/Input';
import Loader from '../../components/Loader';
import LoadingButton from '../../components/LoadingButton';
import PageHeader from '../../components/PageHeader';
import Select from '../../components/Select';
import SelectVariations from '../../components/sale/SelectVariations';
import { createSaleAction } from '../../redux/salesSlice';
import { getStoreAction, selectStoreById } from '../../redux/storesSlice';
import { getAllUsersAction, selectLoggedInUser } from '../../redux/usersSlice';
import { createSaleSchema } from '../../validations/sales.validation';
// import { MuiTelInput } from 'mui-tel-input'

const CreateSalePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector(selectLoggedInUser);
  // const users = useSelector(selectAllUsersByRole('USER'));
  const store = useSelector(selectStoreById(profile.storeId));
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // const customers = useMemo(() => {
  //   return users.map((user) => {
  //     return { label: user.name, value: user.id };
  //   });
  // }, [users]);

  const methods = useForm({
    mode: 'all',
    criteriaMode: 'all',
    resolver: yupResolver(createSaleSchema),
    defaultValues: {
      storeId: null,
      variations: {},
      paymentMethod: 'CASH',
      clientName: '',
      phone: '',
    },
  });

  const { control, setValue, watch, handleSubmit } = methods;

  const onSubmit = (data) => {
    setLoading(true);
    dispatch(createSaleAction(data)).then(({ error }) => {
      setLoading(false);
      if (error) {
        return toast.error(error.message);
      } else {
        navigate('/dashboard/sales');
      }
    });
  };

  useEffect(() => {
    Promise.all([dispatch(getStoreAction(profile.storeId)), dispatch(getAllUsersAction({ role: ['USER'] }))]).then(
      (resp) => {
        setInitLoading(false);
        resp.forEach(({ error }) => {
          if (error) toast.error(error.message);
        });
      }
    );
  }, [dispatch, profile.storeId]);
  useLayoutEffect(() => {
    if (store) {
      setValue('storeId', store.id);
    }
  }, [setValue, store]);

  if (!store && initLoading) {
    return (
      <Box className="size-full flex">
        <Loader className="m-auto" />
      </Box>
    );
  }

  return (
    <FormProvider {...methods}>
      <Form control={control} method="post" action="" onSubmit={handleSubmit(onSubmit)}>
        <Box className="size-full flex flex-col">
          <PageHeader title="Make a sell" hasBack={true} />
          <Box className="px-4 py-2">
            <Box className="px-4 py-4">
              {/* <Controller
                disabled={loading}
                name="storeId"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <AutoCompleteInput
                      label="Store"
                      placeHolder="Choose store to purchase from..."
                      error={!!error}
                      helperText={error?.message}
                      options={options}
                      value={options.find((o) => o.value === field.value)}
                      onChange={(e, option) => field.onChange({ target: { value: option?.value } })}
                      inputProps={{ ...field }}
                    />
                  );
                }}
              /> */}

              <Box className="py-4 mt-2">
                <SelectVariations loading={loading} />
              </Box>

              <Grid container rowSpacing={1} columnSpacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    disabled={loading}
                    name="clientName"
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <Input
                          label="Customer name"
                          placeHolder="Enter customer name..."
                          error={!!error}
                          helperText={error?.message}
                          inputProps={{ ...field }}
                        />
                      );
                    }}
                  />

                  <Controller
                    name="isMember"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} disabled={loading} />}
                        label="Is member"
                        sx={{ fontWeight: 'bold' }}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    disabled={loading}
                    name="phone"
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <Input
                          label="Phone number"
                          placeHolder="Enter phone number ..."
                          error={!!error}
                          helperText={error?.message}
                          inputProps={{ ...field }}
                        />
                      );
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    disabled={loading}
                    name="paymentMethod"
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <Select
                          label="Payment method"
                          error={!!error}
                          helperText={error?.message}
                          inputProps={{ ...field }}
                        >
                          <MenuItem value="P.O.S">P.O.S</MenuItem>
                          <MenuItem value="CASH" selected>
                            CASH
                          </MenuItem>
                          <MenuItem value="M-PESA">M Pesa</MenuItem>
                          <MenuItem value="E-MOLA">E MOla</MenuItem>
                          <MenuItem value="BANCO BIM">Banco BIM</MenuItem>
                          <MenuItem value="BANCO BCI">Banco BCI</MenuItem>
                        </Select>
                      );
                    }}
                  />
                </Grid>
              </Grid>

              <Stack direction="row" spacing={2} className="justify-end mt-4">
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  type="submit"
                  disabled={Object.keys(watch('variations') || {}).length <= 0}
                >
                  Confirm Payment
                </LoadingButton>
                <Button LinkComponent={Link} to={-1} disabled={loading} variant="contained" color="secondary">
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Form>
    </FormProvider>
  );
};

export default CreateSalePage;

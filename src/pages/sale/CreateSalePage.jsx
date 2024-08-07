import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Checkbox, FormControlLabel, Grid, MenuItem, Stack } from '@mui/material';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
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
import { selectLoggedInUser } from '../../redux/usersSlice';
import { createSaleSchema } from '../../validations/sales.validation';
import { format } from 'date-fns';
import { getAllClientsAction, selectAllClients } from '../../redux/clientSlice';
import AutoCompleteInput from '../../components/AutoCompleteInput';

const CreateSalePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector(selectLoggedInUser);
  const store = useSelector(selectStoreById(profile.storeId));
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const clients = useSelector(selectAllClients);

  const methods = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
    resolver: yupResolver(createSaleSchema),
    defaultValues: {
      storeId: null,
      variations: {},
      paymentMethod: 'CASH',
      clientName: '',
      phone: '',
      isMember: false,
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
    Promise.all([dispatch(getStoreAction(profile.storeId)), dispatch(getAllClientsAction())]).then((resp) => {
      setInitLoading(false);
      resp.forEach(({ error }) => {
        if (error) toast.error(error.message);
      });
    });
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
      <form method="post" action="" onSubmit={handleSubmit(onSubmit)}>
        <Box className="size-full flex flex-col">
          <PageHeader title="Make a sell" hasBack={true} />
          <Box className="px-4 py-2">
            <Box className="px-4 py-4">
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
                        <AutoCompleteInput
                          freeSolo
                          label="Client name"
                          placeHolder="Choose or enter a value"
                          error={!!error}
                          helperText={error?.message}
                          options={clients}
                          value={clients.find((client) => client.name === field.value) || field.value}
                          onChange={(_, newValue) => {
                            if (typeof newValue === 'string') {
                              setValue('clientName', newValue);
                              setValue('phone', '');
                              setValue('isMember', false);
                            } else if (newValue && newValue.inputValue) {
                              setValue('clientName', newValue.inputValue);
                              setValue('phone', '');
                              setValue('isMember', false);
                            } else {
                              setValue('clientName', newValue?.name || '');
                              setValue('phone', newValue?.phone || '');
                              setValue('isMember', newValue?.isMember || false);
                            }
                          }}
                          inputValue={field.value}
                          onInputChange={(event, newInputValue) => {
                            setValue('clientName', newInputValue);
                          }}
                          getOptionLabel={(option) => {
                            if (typeof option === 'string') {
                              return option;
                            }
                            if (option.inputValue) {
                              return option.inputValue;
                            }
                            return option.name;
                          }}
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              {option.name} ({option.phone})
                            </Box>
                          )}
                          filterOptions={(options, params) => {
                            let filtered = options.filter((option) => {
                              if (typeof option === 'string') {
                                return option.toLowerCase().includes(params.inputValue.toLowerCase());
                              }
                              if (option.inputValue) {
                                return option.inputValue.toLowerCase().includes(params.inputValue.toLowerCase());
                              }
                              return option.name.toLowerCase().includes(params.inputValue.toLowerCase());
                            });

                            if (params.inputValue !== '') {
                              filtered.push({
                                inputValue: params.inputValue,
                                name: `Add "${params.inputValue}"`,
                              });
                            }

                            return filtered;
                          }}
                        />
                      );
                    }}
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

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="isMember"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} disabled={loading} />}
                        label="Is member"
                        sx={{ fontWeight: 'bold' }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ marginTop: '4px' }}>
                  <Controller
                    name="doneOn"
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <Input
                          disabled={loading}
                          label="Date of payment"
                          placeHolder="Enter the Date of Payment..."
                          error={!!error}
                          helperText={error?.message}
                          inputProps={{
                            ...field,
                            type: 'datetime-local',
                            InputProps: {
                              inputProps: {
                                max: `${format(new Date(), 'yyyy-MM-dd')}T${format(new Date(), 'hh:mm')}`,
                                defaultValue: `${format(new Date(), 'yyyy-MM-dd')}T${format(new Date(), 'hh:mm')}`,
                              },
                            },
                          }}
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
      </form>
    </FormProvider>
  );
};

export default CreateSalePage;

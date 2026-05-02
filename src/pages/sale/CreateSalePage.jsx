import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AutoCompleteInput from '../../components/AutoCompleteInput';
import Input from '../../components/Input';
import Loader from '../../components/Loader';
import LoadingButton from '../../components/LoadingButton';
import PageHeader from '../../components/PageHeader';
import Select from '../../components/Select';
import SelectVariations from '../../components/sale/SelectVariations';
import { getAllClientsAction, selectAllClients } from '../../redux/clientSlice';
import { selectAllCombos } from '../../redux/combosSlice';
import { getAllStoreProductsAction, selectAllProductsBystoreId } from '../../redux/productsSlice';
import { createSaleAction } from '../../redux/salesSlice';
import { getStoreAction, selectStoreById } from '../../redux/storesSlice';
import { selectLoggedInUser } from '../../redux/usersSlice';
import { createSaleSchema } from '../../validations/sales.validation';

const CreateSalePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector(selectLoggedInUser);
  const store = useSelector(selectStoreById(profile.storeId));
  const storeProducts = useSelector(selectAllProductsBystoreId(profile.storeId));
  const combos = useSelector(selectAllCombos);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const methods = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
    resolver: yupResolver(createSaleSchema),
    defaultValues: {
      storeId: null,
      variations: {},
      combos: {},
      payments: [{ paymentMethod: 'CASH', amount: 0 }],
      clientName: '',
      phone: '',
      isMember: false,
    },
  });
  const { control, setValue, watch, handleSubmit } = methods;

  const {
    fields: paymentFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'payments',
  });

  const variations = watch('variations');
  const selectedCombos = watch('combos');
  const payments = watch('payments') || [];

  const calculateTotalAmount = () => {
    let allVariationsFromProducts = (storeProducts || []).map((product) => product.variations).flat();

    let total = 0;

    Object.entries(variations || {}).forEach(([key, quantity]) => {
      const variation = allVariationsFromProducts.find((v) => v.id === key);
      if (variation) {
        total += quantity * variation.sellingPrice;
      }
    });

    Object.entries(selectedCombos || {}).forEach(([key, quantity]) => {
      const combo = (combos || []).find((m) => m.id === key);
      if (combo) {
        total += quantity * combo.sellingPrice;
      }
    });

    if (total !== totalAmount) setTotalAmount(total);
  };

  const clients = useSelector(selectAllClients);

  const totalPayments = payments.reduce((sum, p) => sum + Number(p?.amount || 0), 0);
  const remainingAmount = totalAmount - totalPayments;

  const onSubmit = (data) => {
    if (remainingAmount !== 0) {
      return toast.error('Total payment amount must equal the sale total');
    }
    const payload = { ...data };
    if (!Object.keys(payload.variations || {}).length) {
      delete payload.variations;
    }
    if (!Object.keys(payload.combos || {}).length) {
      delete payload.combos;
    }
    if (Array.isArray(payload.payments) && payload.payments.length) {
      payload.payments = payload.payments.map((payment) => ({
        ...payment,
        amount: Number(payment.amount || 0),
      }));
    }

    setLoading(true);
    dispatch(createSaleAction(payload)).then((action) => {
      setLoading(false);
      if (action.error) {
        const message = action.payload?.message || action.error.message;
        return toast.error(message);
      } else {
        navigate('/dashboard/sales');
      }
    });
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [variations, selectedCombos, storeProducts, combos]);

  useEffect(() => {
    if (payments.length === 1) {
      setValue('payments.0.amount', totalAmount);
    }
  }, [payments.length, setValue, totalAmount]);

  useEffect(() => {
    Promise.all([
      dispatch(getStoreAction(profile.storeId)),
      dispatch(getAllStoreProductsAction({ storeId: profile.storeId })),
      dispatch(getAllClientsAction()),
    ]).then((resp) => {
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
                <SelectVariations loading={loading} onQuantityChange={calculateTotalAmount} />

                {totalAmount > 0 && (
                  <Box className="bg-primary-light mx-2 rounded-sm w-fit px-4 py-2 mt-4 mb-4">
                    <Typography variant="h6" className=" text-sm text-background">
                      {' '}
                      Total Amount: {totalAmount} MZN
                    </Typography>
                  </Box>
                )}
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
                          // filterOptions={(options, params) => {
                          //   let filtered = options.filter((option) => {
                          //     if (typeof option === 'string') {
                          //       return option.toLowerCase().includes(params.inputValue.toLowerCase());
                          //     }
                          //     if (option.inputValue) {
                          //       return option.inputValue.toLowerCase().includes(params.inputValue.toLowerCase());
                          //     }
                          //     return option.name.toLowerCase().includes(params.inputValue.toLowerCase());
                          //   });

                          //   if (params.inputValue !== '') {
                          //     filtered.push({
                          //       inputValue: params.inputValue,
                          //       name: `Add "${params.inputValue}"`,
                          //     });
                          //   }

                          //   return filtered;
                          // }}
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
                                max: `${format(new Date(), 'yyyy-MM-dd')}T${format(new Date(), 'HH:mm')}`,
                                defaultValue: `${format(new Date(), 'yyyy-MM-dd')}T${format(new Date(), 'HH:mm')}`,
                              },
                            },
                          }}
                        />
                      );
                    }}
                  />
                </Grid>

                <Controller
                  name="payments"
                  control={control}
                  render={({ fieldState }) => (
                    <Box className="px-4 pt-4 w-full">
                      <Typography variant="subHeader" className="font-medium pb-2">
                        Payments <span className="text-secondary"> *</span>
                      </Typography>
                      {paymentFields.map((payment, index) => (
                        <Grid container item xs={12} columnSpacing={2} key={payment.id}>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              disabled={loading}
                              name={`payments.${index}.paymentMethod`}
                              control={control}
                              render={({ field, fieldState: { error } }) => {
                                return (
                                  <Select
                                    label={`Payment method ${paymentFields.length > 1 ? index + 1 : ''}`}
                                    error={!!error}
                                    helperText={error?.message}
                                    inputProps={{ ...field }}
                                  >
                                    <MenuItem value="P.O.S">P.O.S</MenuItem>
                                    <MenuItem value="CASH">CASH</MenuItem>
                                    <MenuItem value="M-PESA">M Pesa</MenuItem>
                                    <MenuItem value="E-MOLA">E MOla</MenuItem>
                                    <MenuItem value="BANCO BIM">Banco BIM</MenuItem>
                                    <MenuItem value="BANCO BCI">Banco BCI</MenuItem>
                                  </Select>
                                );
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <Controller
                              disabled={loading}
                              name={`payments.${index}.amount`}
                              control={control}
                              render={({ field, fieldState: { error } }) => {
                                return (
                                  <Input
                                    label="Payment amount"
                                    placeHolder="Amount"
                                    error={!!error}
                                    helperText={error?.message}
                                    inputProps={{ ...field, type: 'number', min: 0 }}
                                  />
                                );
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={2} className="pt-2 sm:pt-5">
                            {paymentFields.length > 1 && (
                              <Button
                                variant="outlined"
                                color="secondary"
                                disabled={loading}
                                onClick={() => remove(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      ))}

                      {fieldState.error && (
                        <FormHelperText error={true}>
                          {fieldState.error.message || fieldState.error.root?.message}
                        </FormHelperText>
                      )}
                    </Box>
                  )}
                />

                <Grid item xs={12} className="flex flex-col gap-2">
                  <Typography variant="body2" color="secondary">
                    Total payments: {totalPayments} MZN
                  </Typography>
                  <Typography variant="body2" color={remainingAmount === 0 ? 'primary.light' : 'error'}>
                    Remaining: {remainingAmount} MZN
                  </Typography>
                  <Button
                    variant="outlined"
                    disabled={loading}
                    onClick={() =>
                      append({
                        paymentMethod: 'CASH',
                        amount: Math.max(remainingAmount, 0),
                      })
                    }
                  >
                    Add payment method
                  </Button>
                </Grid>
              </Grid>

              <Stack direction="row" spacing={2} className="justify-end mt-4">
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  type="submit"
                  disabled={
                    (Object.keys(variations || {}).length <= 0 && Object.keys(selectedCombos || {}).length <= 0) ||
                    remainingAmount !== 0
                  }
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

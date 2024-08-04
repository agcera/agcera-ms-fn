import { useTheme } from '@emotion/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, MenuItem, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, Form, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { GrDocumentDownload } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../axios';
import ActionButton from '../../components/ActionButton';
import AutoCompleteInput from '../../components/AutoCompleteInput';
import Input from '../../components/Input';
import Loader from '../../components/Loader';
import LoadingButton from '../../components/LoadingButton';
import PageHeader from '../../components/PageHeader';
import { getAllStoresAction, selectAllStores, storeCollectProfitAction } from '../../redux/storesSlice';
import { tokens } from '../../themeConfig';
import { formatQuery } from '../../utils/formatters';
import { generateReportSchema } from '../../validations/reports.validation';
import { selectLoggedInUser } from '../../redux/usersSlice';
import { format } from 'date-fns';
import Select from '../../components/Select';

const GenerateReportPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const stores = useSelector(selectAllStores);
  const [loading, setLoading] = useState(false);
  const [initLoading, setinitLoading] = useState(true);
  const [url, setUrl] = useState(null);
  const [collected, setCollected] = useState(false);

  const colors = tokens(theme.palette.mode);

  const methods = useForm({
    resolver: yupResolver(generateReportSchema),
    defaultValues: {
      from: `${format(new Date(), 'yyyy-MM-dd')}T00:00`,
      to: `${format(new Date(), 'yyyy-MM-dd')}T23:59`,
      storeId: '',
      includeChecked: true,
    },
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { dirtyFields },
  } = methods;

  const storeId = watch('storeId');

  const onSubmit = async (data) => {
    setLoading(true);
    const resp = await axiosInstance.get(
      `/report?${formatQuery({
        ...data,
        from: new Date(data.from).toISOString(),
        to: new Date(data.to).toISOString(),
        storeId: data.storeId || undefined,
      })}`,
      { responseType: 'blob' }
    );
    setLoading(false);

    const url = URL.createObjectURL(resp.data);
    setUrl(url);
  };

  const handleCollectProfit = async () => {
    setLoading(true);
    const data = methods.getValues();
    dispatch(
      storeCollectProfitAction({
        from: new Date(data.from).toISOString(),
        to: new Date(data.to).toISOString(),
        storeId: data.storeId,
      })
    ).then(({ error }) => {
      setLoading(false);
      if (error) {
        toast.error('Failed to collect profit: ' + error.message);
      } else {
        toast.success('Profit collected successfully');
        setCollected(true);
      }
    });
  };

  const handleReGenerate = () => {
    setCollected(false);
    setUrl(null);
  };

  useEffect(() => {
    dispatch(getAllStoresAction()).then(({ error }) => {
      setinitLoading(false);
      if (error) toast.error('Failed to load stores');
    });
  }, [dispatch]);
  useEffect(() => {
    let lastCollectedAt;
    if (!stores?.length) return;
    if (!storeId) {
      lastCollectedAt = stores[0].lastCollectedAt;
      if (!lastCollectedAt) return;
    } else {
      const store = stores.find((s) => s.id === storeId);
      lastCollectedAt = store?.lastCollectedAt;
      if (!lastCollectedAt) return;
    }
    !dirtyFields['from'] &&
      setValue(
        'from',
        `${format(new Date(lastCollectedAt), 'yyyy-MM-dd')}T${format(new Date(lastCollectedAt), 'HH:mm')}`,
        {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        }
      );
    const to =
      new Date(lastCollectedAt).toISOString() < new Date().toISOString() ? new Date() : new Date(lastCollectedAt);
    !dirtyFields['to'] &&
      setValue('to', `${format(to, 'yyyy-MM-dd')}T${format(to, 'HH:mm')}`, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stores, storeId, setValue]);

  if (!stores?.length > 0 && initLoading) {
    return (
      <Box className="size-full flex">
        <Loader className="m-auto" />
      </Box>
    );
  }

  return (
    <FormProvider {...methods}>
      <Form control={control} method="get" action="" className="size-full" onSubmit={handleSubmit(onSubmit)}>
        <Box className="size-full">
          <PageHeader
            title="Generate Report"
            hasBack={true}
            otherActions={
              url && [
                <ActionButton
                  color="primary.light"
                  className="text-white"
                  key="0"
                  disabled={collected}
                  onClick={handleCollectProfit}
                  content="Collect Profit"
                />,
                <ActionButton
                  bg={colors.blue.main}
                  color={colors.text_dark.main}
                  LinkComponent="a"
                  key="1"
                  href={url}
                  download="report.pdf"
                  content={
                    <div className="flex gap-2 items-center">
                      <GrDocumentDownload /> Download
                    </div>
                  }
                />,
                <ActionButton
                  bg={colors.blue.main}
                  color={colors.text_dark.main}
                  key="2"
                  onClick={handleReGenerate}
                  content="Re-generate"
                />,
              ]
            }
          />
          {!url && <GeneratePageForm {...{ loading }} />}
          {url && <embed type="application/pdf" src={url} width="100%" height="100%" />}
        </Box>
      </Form>
    </FormProvider>
  );
};

export default GenerateReportPage;

const GeneratePageForm = ({ loading }) => {
  const stores = useSelector(selectAllStores);
  const user = useSelector(selectLoggedInUser);

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const options = useMemo(() => {
    return stores?.map((store) => ({ ...store, label: store.name, value: store.id }));
  }, [stores]);

  return (
    <>
      <Grid container className="px-4 mb-4" rowSpacing={1} columnSpacing={2}>
        <Grid item xs={12} sm={user.role === 'admin' && 6}>
          <Input
            disabled={loading}
            label="From"
            placeHolder="Enter the start date for the report..."
            error={!!errors.from}
            helperText={errors.from?.message}
            inputProps={{
              ...register('from'),
              type: 'datetime-local',
              InputProps: {
                inputProps: {
                  max: `${format(new Date(), 'yyyy-MM-dd')}T${format(new Date(), 'hh:mm')}`,
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={user.role === 'admin' && 6}>
          <Input
            disabled={loading}
            label="To"
            placeHolder="Enter the End date for the report..."
            error={!!errors.to}
            helperText={errors.to?.message}
            inputProps={{
              ...register('to'),
              type: 'datetime-local',
              InputProps: {
                inputProps: {
                  min: `${format(new Date(watch('from') || Date.now()), 'yyyy-MM-dd')}T${format(new Date(watch('from') || Date.now()), 'hh:mm')}`,
                },
              },
            }}
          />
        </Grid>
        {user.role === 'admin' && (
          <>
            <Grid item xs={12} sm={6}>
              <Controller
                name="storeId"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <AutoCompleteInput
                      label="Store"
                      placeHolder="Select a store to generate a report or leave empty to generate a report for all stores..."
                      error={!!error}
                      helperText={error?.message}
                      required={false}
                      options={options}
                      disabled={loading}
                      value={options.find((o) => o.value === field.value)}
                      onChange={(e, option) => field.onChange(option.value)}
                      inputProps={{ ...field }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="includeChecked"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <Select
                      label="Include collected sales and transactions"
                      error={!!error}
                      helperText={error?.message}
                      required={false}
                      disabled={loading}
                      inputProps={{ ...field }}
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  );
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
      <Stack spacing={2} direction="row" justifyContent="flex-end" className="px-4 mb-4">
        <LoadingButton loading={loading} type="submit">
          Generate Report
        </LoadingButton>
        <Button disabled={loading} LinkComponent={Link} to={-1} color="secondary">
          cancel
        </Button>
      </Stack>
    </>
  );
};

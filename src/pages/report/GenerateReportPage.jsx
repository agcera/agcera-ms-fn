import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, Form, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../axios';
import AutoCompleteInput from '../../components/AutoCompleteInput';
import Input from '../../components/Input';
import Loader from '../../components/Loader';
import LoadingButton from '../../components/LoadingButton';
import PageHeader from '../../components/PageHeader';
import { getAllStoresAction, selectAllStores } from '../../redux/storesSlice';
import { formatQuery } from '../../utils/formatters';
import { generateReportSchema } from '../../validations/reports.validation';

const GenerateReportPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [initLoading, setinitLoading] = useState(true);
  const stores = useSelector(selectAllStores);
  const [url, setUrl] = useState(null);

  const methods = useForm({
    resolver: yupResolver(generateReportSchema),
    defaultValues: {
      from: null,
      to: null,
      storeId: '',
    },
  });
  const { control, handleSubmit } = methods;

  const onSubmit = async (data) => {
    setLoading(true);
    const resp = await axiosInstance.get(
      `/report?${formatQuery({
        from: new Date(data.from).toLocaleDateString(),
        to: new Date(data.to).toLocaleDateString(),
        storeId: data.storeId,
      })}`,
      { responseType: 'blob' }
    );
    setLoading(false);

    const url = URL.createObjectURL(resp.data);
    setUrl(url);
  };

  useEffect(() => {
    dispatch(getAllStoresAction()).then(({ error }) => {
      setinitLoading(false);
      if (error) toast.error('Failed to load stores');
    });
  }, [dispatch]);

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
                <Button LinkComponent="a" key="0" href={url} download="report.pdf">
                  Download
                </Button>,
                <Button key="1" color="secondary" onClick={() => setUrl(null)}>
                  Re-generate
                </Button>,
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
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const options = useMemo(() => {
    return stores?.map((store) => ({ ...store, label: store.name, value: store.id }));
  }, [stores]);

  return (
    <>
      <Grid container className="px-4 mb-4" rowSpacing={1} columnSpacing={2}>
        <Grid item xs={12} sm={6}>
          <Input
            disabled={loading}
            label="From"
            placeHolder="Enter the start date for the report..."
            error={!!errors.from}
            helperText={errors.from?.message}
            inputProps={{ ...register('from'), type: 'date' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            disabled={loading}
            label="To"
            placeHolder="Enter the End date for the report..."
            error={!!errors.to}
            helperText={errors.to?.message}
            inputProps={{ ...register('to'), type: 'date' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            disabled={loading}
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

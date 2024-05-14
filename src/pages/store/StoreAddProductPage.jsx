import { Box, Button, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';
import {
  getAllProductsAction,
  getProductAction,
  selectAllProducts,
  selectProductById,
} from '../../redux/productsSlice';
import {
  getAllStoresAction,
  getStoreAction,
  selectAllStores,
  selectStoreById,
  storeAddMoveProductAction,
} from '../../redux/storesSlice';
import { Controller, Form, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { storeAddMoveProductSchema } from '../../validations/stores.validation';
import AutoCompleteInput from '../../components/AutoCompleteInput';
import Input from '../../components/Input';
import LoadingButton from '../../components/LoadingButton';

const StoreAddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const store = useSelector(selectStoreById(id));
  const stores = useSelector(selectAllStores);
  const products = useSelector(selectAllProducts);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const { control, watch, setValue, handleSubmit } = useForm({
    resolver: yupResolver(storeAddMoveProductSchema),
    defaultValues: {
      fromQuantity: Number.POSITIVE_INFINITY,
      from: null,
      to: id,
      productId: null,
      quantity: 1,
    },
  });

  const [productId, from] = watch(['productId', 'from']);
  const product = useSelector(selectProductById(productId));

  const productStoresOptions = useMemo(() => {
    const stores = product?.stores;
    if (!stores) return [];
    return stores.map((productStore) => ({
      ...productStore,
      ...productStore.store,
      label: productStore.store.name,
      value: productStore.store.id,
    }));
  }, [product]);
  const allStoresOptions = useMemo(() => {
    if (!stores) return [];
    return stores.map((store) => ({ ...store, label: store.name, value: store.id }));
  }, [stores]);

  const productsOptions = useMemo(() => {
    if (!products) return [];
    return products.map((product) => ({ ...product, label: product.name, value: product.id }));
  }, [products]);

  const fromOption = useMemo(() => {
    return productStoresOptions.find((s) => s.value === from);
  }, [from, productStoresOptions]);

  const onSubmit = (data) => {
    if (data.fromQuantity) delete data.fromQuantity;
    setLoading(true);
    dispatch(storeAddMoveProductAction(data)).then(({ error }) => {
      setLoading(false);
      if (!error) {
        navigate(`/dashboard/stores/${id || ''}`);
      } else {
        toast.error(error.message);
      }
    });
  };

  useEffect(() => {
    if (!productId) return;
    dispatch(getProductAction(productId)).then(({ error }) => {
      if (error) toast.error(error.message);
    });
  }, [dispatch, productId]);
  useEffect(() => {
    if (!id) return;
    dispatch(getStoreAction(id)).then(({ error }) => {
      setInitLoading(false);
      if (error) toast.error(error.message);
    });
  }, [dispatch, id]);
  useEffect(() => {
    Promise.all([dispatch(getAllStoresAction()), dispatch(getAllProductsAction())])
      .then((resp) => {
        resp.forEach(({ error }) => {
          if (error) toast.error(error.message);
        });
      })
      .finally(() => {
        setInitLoading(false);
      });
  }, [dispatch]);

  if (initLoading && (!store || !stores?.length || !products?.length)) {
    return (
      <Box className="size-full flex">
        <Loader className="m-auto" />
      </Box>
    );
  }

  if (!store) {
    <Box className="w-full overflow-y-auto">
      <PageHeader
        title={id ? `Add products in store` : `Add or move products`}
        hasBack={true}
        backTo="/dashboard/stores"
      />
      <Typography color="secondary.light" className="text-center p-4">
        Store not found
      </Typography>
    </Box>;
  }

  return (
    <Form control={control} method="post" action="" onSubmit={handleSubmit(onSubmit)}>
      <Box className="w-full overflow-y-auto">
        <PageHeader
          title={id ? `Add products in store` : `Add or move products`}
          hasBack={true}
          backTo="/dashboard/stores"
        />
        <Box className="px-4 flex flex-col gap-2">
          <Controller
            control={control}
            name="productId"
            render={({ field, fieldState: { error } }) => {
              return (
                <AutoCompleteInput
                  disabled={loading}
                  options={productsOptions}
                  label="Product"
                  placeHolder="Select the product to add or move"
                  error={!!error}
                  helperText={error?.message}
                  value={productsOptions.find((o) => o.value === field.value)}
                  onChange={(e, option) => field.onChange({ target: { value: option.value } })}
                  inputProps={{ ...field }}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="from"
            render={({ field, fieldState: { error } }) => {
              const value = productStoresOptions.find((o) => o.value === field.value);
              return (
                <AutoCompleteInput
                  disabled={!product || loading}
                  options={productStoresOptions}
                  label="From"
                  placeHolder="Enter the store source of the products, leave empty if adding to main store..."
                  error={!!error}
                  helperText={error?.message || (value && `${value.quantity || 0} products are available`)}
                  required={false}
                  value={value}
                  onChange={(e, option) => {
                    field.onChange({ target: { value: option.value } });
                    setValue('fromQuantity', option.quantity);
                  }}
                  inputProps={{ ...field }}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="to"
            render={({ field, fieldState: { error } }) => {
              return (
                <AutoCompleteInput
                  disabled={!!id || !product || loading}
                  options={allStoresOptions}
                  label="To"
                  placeHolder="Enter the store destination of the products"
                  error={!!error}
                  helperText={error?.message}
                  value={allStoresOptions.find((o) => o.value === field.value)}
                  onChange={(e, option) => field.onChange({ target: { value: option.value } })}
                  inputProps={{ ...field }}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="quantity"
            render={({ field, fieldState: { error } }) => {
              return (
                <Input
                  disabled={loading}
                  label="Number of products"
                  placeHolder="Enter the number product to add or move"
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{ ...field, type: 'number', inputProps: { min: 1, max: fromOption?.quantity } }}
                />
              );
            }}
          />
        </Box>
        <Box className="flex gap-2 justify-end p-4">
          <LoadingButton loading={loading} type="submit">
            Submit
          </LoadingButton>
          <Button disabled={loading} LinkComponent={Link} to="/dashboard/stores" color="secondary">
            Cancel
          </Button>
        </Box>
      </Box>
    </Form>
  );
};

export default StoreAddProductPage;

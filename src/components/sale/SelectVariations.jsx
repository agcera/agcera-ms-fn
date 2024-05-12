import { Box, ListItemText, MenuItem, Stack, Table, TableBody, Typography, capitalize } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getAllStoreProductsAction, selectAllProductsBystoreId } from '../../redux/productsSlice';
import AutoCompleteInput from '../AutoCompleteInput';
import Loader from '../Loader';
import SelectVariationsRow from './SelectVariationsRow';

const SelectVariations = ({ loading }) => {
  const dispatch = useDispatch();
  const { setValue, watch } = useFormContext();
  const [input, setInput] = useState('');
  const remainingProductsRef = useRef({});
  const [fetchVariationLoading, setFetchVariationLoading] = useState(false);

  const watchedVariations = watch('variations');

  const storeId = watch('storeId');
  const products = useSelector(selectAllProductsBystoreId(storeId));
  const variations = useMemo(() => {
    return products?.reduce((acc, product) => {
      const variations = product.variations;
      return [
        ...acc,
        ...variations.map((variation) => {
          return {
            ...variation,
            label: `${capitalize(product.name)} (${capitalize(variation.name)})`,
            value: variation.id,
          };
        }),
      ];
    }, []);
  }, [products]);
  const fields = Object.entries(watchedVariations || {});

  const handleProductChoosed = (e, option) => {
    setInput('');
    // Get the removed products and total products in store
    const variation = variations.find((v) => v.value === option.value);
    const product = products.find((p) => p.id === variation.productId);
    const storeProduct = product.stores.find((s) => s.storeId === storeId);
    const total = storeProduct.quantity;
    const remaining = remainingProductsRef[variation.productId];
    const newRemaining = remaining ? remaining - variation.number : total - variation.number;
    if (newRemaining < 0) {
      return toast.error('No more of these products in store');
    }
    // Update remaining products
    remainingProductsRef[variation.productId] = newRemaining;
    // Add variation to form
    setValue(`variations.${option.value}`, 1);
  };
  const handleRemove = (id) => {
    const variation = variations.find((v) => v.value === id);
    const newVariations = { ...watchedVariations };

    // Update remaining products
    const removedProducts = newVariations[id] * variation.number;
    const remaining = remainingProductsRef[variation.productId];
    remainingProductsRef[variation.productId] = remaining + removedProducts;

    // Remove variation from to be sent on backend
    delete newVariations[id];
    setValue('variations', newVariations);
  };

  useEffect(() => {
    if (!storeId) return;
    setFetchVariationLoading(true);
    dispatch(getAllStoreProductsAction({ storeId })).then(({ error }) => {
      setFetchVariationLoading(false);
      if (error) toast.error(error.message);
    });
  }, [storeId, dispatch]);

  if (!products?.length && fetchVariationLoading) {
    return (
      <Box className="flex flex-col px-2 mb-4 gap-2">
        <Stack direction="row" spacing={2} className="justify-between items-end ">
          <Typography variant="subHeader" className="font-medium">
            Products <span className="text-secondary"> *</span>
          </Typography>
        </Stack>
        <Loader className="m-auto" />
      </Box>
    );
  }

  return (
    <Box className="flex flex-col px-2 mb-4 gap-2">
      <Stack direction="row" spacing={2} className="justify-between items-end ">
        <Typography variant="subHeader" className="font-medium">
          Products <span className="text-secondary"> *</span>
        </Typography>
      </Stack>

      <AutoCompleteInput
        // label="Select products"
        placeHolder="Choose products to purchase..."
        className="mb-4"
        disabled={!storeId || loading}
        options={variations.filter((v) => !fields.find((f) => f[0] === v.value))}
        value={null}
        onChange={handleProductChoosed}
        inputValue={input}
        onInputChange={(e, newValue) => setInput(newValue)}
        renderOption={({ key, ...otherProps }, option) => (
          <MenuItem key={key} {...otherProps}>
            <ListItemText
              primary={option.label}
              secondary={`${option.number} product${option.number > 1 ? 's' : ''}`}
            />
          </MenuItem>
        )}
      />

      <Box className="w-full flex flex-col gap-2">
        {fields.length === 0 && (
          <Typography variant="body1" color="secondary.light" className="text-center">
            No products selected yet, please add atleast one product
          </Typography>
        )}
        <Table className="border-separate border-spacing-y-2">
          <TableBody>
            {fields.map((field) => {
              const variation = variations.find((v) => v.value === field[0]);
              if (!variation) return;
              return (
                <SelectVariationsRow
                  key={field[0]}
                  field={field}
                  loading={loading}
                  variation={variation}
                  handleRemove={handleRemove}
                  remainingProductsRef={remainingProductsRef}
                />
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default SelectVariations;

import { Box, FormControl, MenuItem, Select } from '@mui/material';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import MoreButton from '../../components/Table/MoreButton';
import StatusBadge from '../../components/Table/StatusBadge';
import StyledTable from '../../components/Table/StyledTable';
import { getAllProductsAction, selectAllProducts } from '../../redux/productsSlice';
import { selectLoggedInUser } from '../../redux/usersSlice';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectLoggedInUser);
  const products = useSelector(selectAllProducts);

  const fetchData = useCallback(
    (query) => {
      if (query?.sort) {
        query.sort = Object.keys(query.sort).reduce((acc, key) => {
          switch (key) {
            case 'variations':
              acc['variations.name'] = query.sort[key];
              break;
            case 'sellingPrice':
              acc['variations.sellingPrice'] = query.sort[key];
              break;
            case 'costPrice':
              acc['variations.costPrice'] = query.sort[key];
              break;
            default:
              acc[key] = query.sort[key];
          }
          return acc;
        }, {});
      }
      return dispatch(getAllProductsAction(query));
    },
    [dispatch]
  );

  return (
    <Box className="size-full flex flex-col">
      <PageHeader
        title="Products"
        hasGenerateReport={true}
        hasCreate={user.role === 'admin' && (() => navigate('/dashboard/products/create'))}
      />

      <ProductsTable products={products} fetchData={fetchData} />
    </Box>
  );
};

export default ProductsPage;

export const ProductsTable = ({ products, fetchData, omit = [], storeId }) => {
  const user = useSelector(selectLoggedInUser);
  const [variationMap, setVariationMap] = useState({}); // State to hold selected variation for each row

  const handleChange = (e, id) => {
    const { value } = e.target;
    setVariationMap((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const getSellingPriceForVariation = (variations, selectedVariation) => {
    const variation = variations.find((variation) => variation.name === selectedVariation);
    return variation ? variation.sellingPrice : '';
  };
  const getCostPriceForVariation = (variations, selectedVariation) => {
    const variation = variations.find((variation) => variation.name === selectedVariation);
    return variation ? variation.costPrice : '';
  };

  useEffect(() => {
    // Initialize variationMap with the first variation for each row
    const initialVariationMap = {};
    products.forEach((product) => {
      initialVariationMap[product.id] = product.variations.length > 0 ? product.variations[0].name : '';
    });
    setVariationMap(initialVariationMap);
  }, [products]);

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      flex: 0,
      disableExport: true,

      // in the params there will go the dedicated image for the products
      // eslint-disable-next-line
      renderCell: (params) => {
        return <ZoomableImage image={params.value} />;
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 0,
      renderCell: (params) => {
        return (
          <StatusBadge
            className="min-w-[80px]"
            status={params.value.toLowerCase()}
            bg={params.value === 'STANDARD' ? 'bg-green-500' : 'bg-red-500'}
            color={'white'}
          />
        );
      },
    },
    {
      field: 'stores',
      headerName: 'In store',
      flex: 0,
      align: 'center',
      renderCell: (params) => params.value?.find((s) => s.storeId === storeId).quantity,
    },
    {
      field: 'variations',
      headerName: 'Variations',
      flex: 1,
      disableExport: true,
      renderCell: (params) => {
        return (
          <FormControl fullWidth variant="filled" sx={{ borderBottom: 'none' }}>
            <Select
              className="bg-background mt-[-10px] border-none"
              value={variationMap[params.row.id] || ''}
              onChange={(e) => handleChange(e, params.row.id)}
            >
              {(params.value || []).map((param) => (
                <MenuItem key={param.id} value={param.name}>
                  {param.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      },
    },
    {
      field: 'sellingPrice',
      headerName: 'Selling Price',
      flex: 1,
      valueGetter: (params, row) => {
        const selectedVariation = variationMap[row.id] || '';
        const price = getSellingPriceForVariation(row.variations, selectedVariation);
        return `${price} MZN`;
      },
    },
    user.role === 'admin' && {
      field: 'costPrice',
      headerName: 'Cost Price',
      flex: 1,
      valueGetter: (params, row) => {
        const selectedVariation = variationMap[row.id] || '';
        const price = getCostPriceForVariation(row.variations, selectedVariation);
        return `${price} MZN`;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      flex: 1,
      valueGetter: (params, row) => (row.createdAt ? format(new Date(row.createdAt), 'do MMM yyyy') : 'N/a'),
    },
    user.role === 'admin' && {
      field: 'action',
      headerName: 'Action',
      flex: 0,
      disableExport: true,
      sortable: false,
      renderCell: (params) => {
        return <MoreButton id={params.id} model={'products'} hasDetails={false} hasDelete={true} />;
      },
    },
  ].filter((b) => b && !omit.includes(b.field) && !(!storeId && b.field === 'stores'));

  // zoomable image
  const ZoomableImage = ({ image }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
      const { left, top, width, height } = e.target.getBoundingClientRect();
      const x = (e.pageX - left) / width;
      const y = (e.pageY - top) / height;
      setCursorPosition({ x, y });
    };

    return (
      <div
        className="relative w-20 h-20 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={image}
          className="absolute top-[-10px] left-0 w-full h-full transition-transform duration-300 transform-gpu"
          style={{
            transform: isHovered
              ? `scale(1.5) translate(-${cursorPosition.x * 50}%, -${cursorPosition.y * 50}%)`
              : 'scale(1)',
          }}
          alt="productImage"
        />
      </div>
    );
  };

  return <StyledTable fetchData={fetchData} columns={columns} data={products} />;
};

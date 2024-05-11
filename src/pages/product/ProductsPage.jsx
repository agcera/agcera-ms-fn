import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, FormControl, MenuItem, Select } from '@mui/material';
import { getAllProductsAction, selectAllProducts } from '../../redux/productsSlice';
import PageHeader from '../../components/PageHeader';
import StyledTable from '../../components/Table/StyledTable';
import Loader from '../../components/Loader';
import MoreButton from '../../components/Table/MoreButton';
import { beauty } from '../../assets';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectAllProducts);

  useEffect(() => {
    dispatch(getAllProductsAction());
  }, [dispatch]);

  const [variationMap, setVariationMap] = useState({}); // State to hold selected variation for each row

  const handleChange = (e, id) => {
    const { value } = e.target;
    setVariationMap((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const getPriceForVariation = (variations, selectedVariation) => {
    const variation = variations.find((variation) => variation.name === selectedVariation);
    return variation ? variation.sellingPrice : '';
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

      // in the params there will go the dedicated image for the products
      // eslint-disable-next-line
      renderCell: (params) => {
        return <ZoomableImage image={beauty} />;
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'variations',
      headerName: 'Variations',
      flex: 1,
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
      field: 'price',
      headerName: 'Price',
      flex: 1,
      renderCell: (params) => {
        const selectedVariation = variationMap[params.row.id] || '';
        const price = getPriceForVariation(params.row.variations, selectedVariation);
        return <Typography className="py-1 mt-4 h-6 text-[14px]">{price} MZN</Typography>;
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 0,
      renderCell: (params) => {
        return (
          <Typography
            className={`rounded-2xl text-white mt-3 text-center px-3 py-1 h-6 text-[12px] overflow-hidden ${params.value === 'STANDARD' ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {params.value.toLowerCase()}
          </Typography>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0,
      renderCell: (params) => {
        return <MoreButton id={params.id} model={'products'} />;
      },
    },
  ];

  if (!(products?.length > 0)) {
    return (
      <Box className="w-full h-full flex">
        <Loader className="m-auto" />
      </Box>
    );
  }

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

  return (
    <Box className="size-full flex flex-col">
      <PageHeader
        title="Products"
        hasGenerateReport={() => {
          console.log('Generate Report of users');
        }}
        hasCreate={() => {
          navigate('/dashboard/products/create');
        }}
      />

      <StyledTable columns={columns} data={products} />
    </Box>
  );
};

export default ProductsPage;

import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsAction, selectAllProducts } from '../redux/productsSlice';
import { useEffect } from 'react';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectAllProducts);

  console.log(products);

  useEffect(() => {
    dispatch(getAllProductsAction());
  }, [dispatch]);

  return (
    <PageHeader
      title="Products"
      hasGenerateReport={() => {
        console.log('Generate Report of users');
      }}
      hasCreate={() => {
        navigate('/dashboard/products/create');
      }}
    />
  );
};

export default ProductsPage;

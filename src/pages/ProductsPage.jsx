import PageHeader from '../components/PageHeader';

const ProductsPage = () => {
  return (
    <PageHeader
      title="Products"
      hasGenerateReport={() => {
        console.log('Generate Report of users');
      }}
      hasCreate={() => {
        console.log('Create user');
      }}
    />
  );
};

export default ProductsPage;

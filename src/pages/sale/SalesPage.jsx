import PageHeader from '../../components/PageHeader';

const SalesPage = () => {
  return (
    <PageHeader
      title="Sales"
      hasGenerateReport={() => {
        console.log('Generate Report of sales');
      }}
      hasCreate={() => {
        console.log('Create sales');
      }}
    />
  );
};

export default SalesPage;

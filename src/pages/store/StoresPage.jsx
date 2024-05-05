import PageHeader from '../../components/PageHeader';

const StoresPage = () => {
  return (
    <PageHeader
      title="Stores"
      hasGenerateReport={() => {
        console.log('Generate Report of stores');
      }}
      hasCreate={() => {
        console.log('Create stores');
      }}
    />
  );
};

export default StoresPage;

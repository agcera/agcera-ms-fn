import PageHeader from '../components/PageHeader';

const TransactionsPage = () => {
  return (
    <PageHeader
      title="Transactions"
      hasGenerateReport={() => {
        console.log('Generate Report of transactions');
      }}
      hasCreate={() => {
        console.log('Create transactions');
      }}
    />
  );
};

export default TransactionsPage;

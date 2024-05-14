import PageHeader from '../../components/PageHeader';

const TransactionsPage = () => {
  return (
    <PageHeader
      title="Transactions"
      hasGenerateReport={true}
      hasCreate={() => {
        console.log('Create transactions');
      }}
    />
  );
};

export default TransactionsPage;

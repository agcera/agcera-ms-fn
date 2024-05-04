import PageHeader from '../components/PageHeader';

function AnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Analytics"
        hasHeader={true}
        hasGenerateReport={() => {
          console.log('Generate Report from dashboard');
        }}
        hasCreate={() => {
          console.log('Create from dashboard');
        }}
      />
    </>
  );
}

export default AnalyticsPage;

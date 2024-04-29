import DashboardSetup from '../components/DashboardSetup';

function DashAnalyticsPage() {
  return (
    <>
      <DashboardSetup
        title="ANALYTICS"
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

export default DashAnalyticsPage;

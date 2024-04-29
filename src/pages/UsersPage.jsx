// import { Box } from '@mui/material'
// import { DataGrid, GridToolbar } from '@mui/x-data-grid'
// import { tokens } from '../themeConfig'
import DashboardPage from '../components/DashboardSetup';

const UsersPage = () => {
  return (
    <>
      <DashboardPage
        title="USERS"
        hasGenerateReport={() => {
          console.log('Generate Report of users');
        }}
        hasCreate={() => {
          console.log('Create user');
        }}
      />
    </>
  );
};
export default UsersPage;

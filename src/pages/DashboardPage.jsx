import Sidebar from '../global/Sidebar';
import Topbar from '../global/Topbar';
import { CssBaseline } from '@mui/material';

const DashboardPage = () => {
  return (
    <>
      <CssBaseline />
      <Topbar />
      <Sidebar />
    </>
  );
};

export default DashboardPage;

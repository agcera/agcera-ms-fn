import PageHeader from './PageHeader';
import Sidebar from '../global/Sidebar';
import Topbar from '../global/Topbar';
import { Box } from '@mui/material';
const DashboardSetup = ({ title, hasGenerateReport, hasCreate }) => {
  return (
    <Box className="flex relative">
      <Topbar />
      <Sidebar />
      <PageHeader title={title} hasGenerateReport={hasGenerateReport} hasCreate={hasCreate} />
    </Box>
  );
};

export default DashboardSetup;

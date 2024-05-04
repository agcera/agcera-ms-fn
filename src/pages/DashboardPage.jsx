import { Box, Container } from '@mui/material';
import Topbar from '../global/Topbar';
import Sidebar from '../global/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <Container className="flex" maxWidth="xl">
      <Sidebar />
      <Box className="flex flex-col w-full h-full grow overflow-y-auto">
        <Topbar />
        <Outlet />
      </Box>
    </Container>
  );
};

export default DashboardPage;

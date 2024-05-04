import { Box, Container } from '@mui/material';
import Topbar from '../global/Topbar';
import Sidebar from '../global/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <Box className="flex">
      <Sidebar />
      <Box className="flex flex-col w-full h-full grow ">
        <Topbar />
        <Container className="overflow-y-auto" maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardPage;

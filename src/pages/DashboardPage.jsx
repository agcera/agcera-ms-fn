import { Box, Container } from '@mui/material';
import Topbar from '../global/Topbar';
import Sidebar from '../global/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <Box className="flex relative h-full">
      <Sidebar />
      <Box className="flex flex-col w-full h-full grow overflow-auto ml-[79px] md:ml-0">
        <Topbar />
        <Container className="overflow-y-auto" maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardPage;

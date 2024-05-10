import { Box } from '@mui/material';
import PageHeader from '../../components/PageHeader';

const StoreAddProductPage = () => {
  return (
    <Box className="w-full overflow-y-auto">
      <PageHeader title={`Add products in store`} hasBack={true} backTo="/dashboard/stores" />
    </Box>
  );
};

export default StoreAddProductPage;

import { Box } from '@mui/material';
import PageHeader from '../../components/PageHeader';

const ViewSalePage = () => {
  return (
    <Box>
      <PageHeader
        title="View Sale"
        hasBack={true}
        backTo="/sales"
        hasDelete={() => {
          console.log('delete sale');
        }}
      />
    </Box>
  );
};

export default ViewSalePage;

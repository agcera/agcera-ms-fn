import { Box, Button, Stack, Typography } from '@mui/material';
import Input from '../Input';

const StyledTextField = ({ ...props }) => {
  return <Input className="max-w-[450px]" {...props} />;
};

const LoginForm = () => {
  return (
    <Box className="flex flex-col gap-4 items-center">
      <StyledTextField label="Phone number" placeHolder="Enter your phone number..." />
      <StyledTextField label="Password" placeHolder="Enter Password..." />

      <Stack direction="row-reverse" className="max-w-[450px] w-full">
        <Typography variant="info1" color="primary.light">
          forgot password? click here
        </Typography>
      </Stack>

      <Button variant="contained" color="specialBlue" className="max-w-[450px] w-full">
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;

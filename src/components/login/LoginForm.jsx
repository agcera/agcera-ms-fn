import { Box, Button, Stack, TextField, Typography } from '@mui/material';

const StyledTextField = ({ ...props }) => {
  return <TextField fullWidth {...props} className="max-w-[450px]" />;
};

const LoginForm = () => {
  return (
    <Box className="flex flex-col gap-4 items-center">
      <StyledTextField />
      <StyledTextField />

      <Stack direction="row-reverse" className="max-w-[450px] w-full">
        <Typography>forgot password? click here</Typography>
      </Stack>

      <Button variant="contained" color="primary" className="max-w-[450px] w-full">
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;

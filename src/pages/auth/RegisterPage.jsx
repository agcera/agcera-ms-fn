import { Box, Container, Typography } from '@mui/material';
import HeaderUnderline from '../../global/HeaderUnderline';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <Container className="w-full h-full flex" maxWidth="xl">
      <Box
        className="relative w-7/12 h-full hidden sm:flex overflow-y-auto"
        sx={{
          backgroundImage: 'url("/images/login_bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: '50% 50%',
        }}
      >
        <Box className="flex flex-col gap-2 p-8 z-10 w-full m-auto">
          <Box className="bg-gray-50/30 h-[130px] px-8 lg:px-16 py-4 backdrop-blur-sm">
            <img src="/images/logo_cropped.png" alt="logo" className="h-full" />
          </Box>

          <Box className="w-full px-8 lg:px-16 py-6 flex flex-col gap-3 bg-primary-light/60 text-white backdrop-blur-sm">
            <Typography variant="header" className="font-semibold leading-tight">
              We help you <br /> get back your health
            </Typography>
            <Typography variant="body1">
              Simple, discreet and convenient. We offer dietary prescriptions for better lifestyle conditions and sexual
              health. All of our treatments are natural, reliable and effective.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="w-full sm:w-5/12 h-full overflow-y-auto flex">
        <Box className="w-full m-auto p-4 sm:p-8">
          <Box className="max-w-[200px] w-full m-auto mb-8 sm:hidden">
            <img src="/images/logo_cropped.png" alt="logo" className="w-full" />
          </Box>
          <Box className="w-full flex flex-col items-center mb-6">
            <Typography variant="header" className="text-center font-semibold text-dark mb-2">
              Register
            </Typography>
            <HeaderUnderline className="m-auto" />
          </Box>
          <RegisterForm />
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;

import { Button } from '@mui/material';

const LoadingButton = ({ children, loading = false, ...props }) => {
  return <Button {...props}>{loading ? 'Loading...' : children}</Button>;
};

export default LoadingButton;

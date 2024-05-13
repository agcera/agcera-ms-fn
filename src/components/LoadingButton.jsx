import { Button, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

const LoadingButton = ({ loading = false, disabled = false, size = 20, children, ...props }) => {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading ? <CircularProgress size={size} /> : children}
    </Button>
  );
};

LoadingButton.propsTypes = {
  loading: PropTypes.bool,
  size: PropTypes.number,
};

export default LoadingButton;

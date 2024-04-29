import { Navigate, useLocation } from 'react-router-dom';

const CheckLoggedIn = ({ children }) => {
  const location = useLocation();

  const token = localStorage.getItem('token');

  if (location.pathname.startsWith('/dashboard')) {
    if (!token) return <Navigate to="/login" />;
  } else {
    // follow the same pattern for other routes
    return children;
  }
  return children;
};

export default CheckLoggedIn;

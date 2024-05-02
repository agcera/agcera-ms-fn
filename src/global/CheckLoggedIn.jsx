import { Navigate, useLocation } from 'react-router-dom';

const CheckLoggedIn = ({ children }) => {
  const location = useLocation();

  const loggedIn = document.cookie.includes('AuthTokenExists=true');

  if (location.pathname.startsWith('/dashboard')) {
    if (!loggedIn) return <Navigate to="/login" />;
  } else {
    if (loggedIn) return <Navigate to="/dashboard" />;
  }
  return children;
};

export default CheckLoggedIn;

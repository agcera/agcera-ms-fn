import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../redux/usersSlice';
import { Navigate } from 'react-router-dom';

const Redirect = () => {
  const user = useSelector(selectLoggedInUser);

  if (user.role === 'user') {
    return <Navigate to="/dashboard/stores" />;
  }
  return <Navigate to="/dashboard/analytics" />;
};

export default Redirect;

import { Paper } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUserAction, selectUserById, selectUserId } from '../redux/usersSlice';

const CheckLoggedIn = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const userId = useSelector(selectUserId);
  const user = useSelector(selectUserById(userId));

  const loggedIn = document.cookie.includes('AuthTokenExists=true');

  useEffect(() => {
    if (loggedIn && !user) {
      // setTimeout is used to avoid the flicker of the loader
      setTimeout(() => {
        dispatch(getUserAction('me'));
      }, 800);
    }
  }, [dispatch, loggedIn, user]);

  if (!location.pathname.startsWith('/dashboard')) {
    if (loggedIn) return <Navigate to="/dashboard" />;
  } else {
    if (!loggedIn) return <Navigate to="/login" />;

    if (!user)
      return (
        <Paper className="w-full h-full flex">
          <Loader className="m-auto" />
        </Paper>
      );
  }

  return children;
};

export default CheckLoggedIn;

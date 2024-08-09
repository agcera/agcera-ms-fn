import { Paper } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getUserAction, selectUserById, selectUserId } from '../redux/usersSlice';
import { toast } from 'react-toastify';

const CheckLoggedIn = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const userId = useSelector(selectUserId);
  const user = useSelector(selectUserById(userId));
  const [error, setError] = useState(null);

  const loggedIn = localStorage.getItem('AuthTokenExists');

  useEffect(() => {
    if (loggedIn && !user) {
      // setTimeout is used to avoid the flicker of the loader
      setTimeout(() => {
        dispatch(getUserAction('me')).then(({ error }) => {
          if (error) {
            toast.error(error.message);
            setError(error.message);
          }
        });
      }, 800);
    }
  }, [dispatch, loggedIn, user]);

  if (
    !location.pathname.startsWith('/dashboard') &&
    !location.pathname.startsWith('/reset-password') &&
    !location.pathname.startsWith('/forgot')
  ) {
    if (loggedIn) return <Navigate to="/dashboard" />;
  } else {
    if (!loggedIn) return <Navigate to="/login" />;
    if (!user && !error)
      return (
        <Paper className="w-full h-full flex">
          <Loader className="m-auto" />
        </Paper>
      );

    if (error) {
      throw new Error(error);
    }
  }

  return children;
};

export default CheckLoggedIn;

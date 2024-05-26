import { useSelector } from 'react-redux';
import Redirect from '../../global/Redirect';
import { selectLoggedInUser } from '../../redux/usersSlice';

const Protected = ({ denied, allowed, Component, ...props }) => {
  const user = useSelector(selectLoggedInUser);

  if ((allowed && !allowed.includes(user.role)) || (denied && denied.includes(user.role))) {
    return <Redirect />;
  }
  return <Component {...props} />;
};

export default Protected;

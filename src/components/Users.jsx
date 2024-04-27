import { useEffect } from 'react';
import { getAllUsers, getAllUsersAction } from '../redux/users/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItem, ListItemText } from '@mui/material';

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(getAllUsers);

  console.log(users);

  useEffect(() => {
    console.log('dispatched');
    dispatch(getAllUsersAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <List>
        {users.map((user) => (
          <ListItem key={user.name}>
            <ListItemText primary={`${user.name} @${user.username} `} secondary={user.email} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Users;

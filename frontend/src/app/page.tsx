"use client"

import { SetStateAction, useEffect, useState } from 'react';
import api from '../services/api';

type User = {
  id: number;
  name: string;
  email: string;
};

const HomePage = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get('/users')
      .then((response: { data: SetStateAction<User[]>; }) => {
        setUsers(response.data);
      })
      .catch((error: any) => {
        console.error('There was an error fetching the users!', error);
      });
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
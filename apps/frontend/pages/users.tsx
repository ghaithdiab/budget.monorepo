import { AuthService } from '@/app/services/Auth.service';
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
// import { AuthService } from '../services/Auth.service';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AuthService.getAllUsers()
      .then((data) => {
        console.log('Fetched Users:', data); // Temporary debug
        setUsers(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((user: { id: Key | null | undefined; email: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; })  => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
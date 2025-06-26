import { Link, Outlet } from "react-router";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Users - React Router App" },
    { name: "description", content: "View all users" },
  ];
}

export default function Users() {
  // Sample user data
  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Bob Johnson" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Users Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">User List</h2>
          <ul>
            {users.map(user => (
              <li key={user.id} className="mb-2">
                <Link 
                  to={`/users/${user.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {user.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="md:col-span-3">
          {/* This is where nested routes will render */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

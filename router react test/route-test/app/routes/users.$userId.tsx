import { useParams } from "react-router";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "User Details - React Router App" },
    { name: "description", content: "View user details" },
  ];
}

export default function UserDetails() {
  // Get the userId parameter from the URL
  const { userId } = useParams();
  
  // In a real app, you would fetch user data based on the ID
  // For this example, we'll use static data
  const userData = {
    1: { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    2: { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
    3: { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
  };
  
  // Convert userId to a number key and check if it exists in userData
  const userIdNum = parseInt(userId || '0', 10);
  const user = userIdNum ? userData[userIdNum as keyof typeof userData] : undefined;
  
  if (!user) {
    return (
      <div className="bg-red-100 p-4 rounded">
        <h2 className="text-xl font-semibold text-red-700">User Not Found</h2>
        <p>The user with ID {userId} does not exist.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Details</h2>
      
      <div className="space-y-3">
        <div>
          <span className="font-semibold">ID:</span> {user.id}
        </div>
        <div>
          <span className="font-semibold">Name:</span> {user.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-semibold">Role:</span> {user.role}
        </div>
      </div>
    </div>
  );
}

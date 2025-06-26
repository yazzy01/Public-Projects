import { Link } from "react-router";

export default function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="text-xl font-bold mb-2 sm:mb-0">React Router Demo</div>
        
        <ul className="flex space-x-4">
          <li>
            <Link 
              to="/" 
              className="hover:text-blue-300 transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className="hover:text-blue-300 transition-colors"
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/users" 
              className="hover:text-blue-300 transition-colors"
            >
              Users
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

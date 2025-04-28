// src/components/Header.jsx
import { Link } from "react-router-dom";
import logo from "../images/logo2.png"; // Import your logo image

const Header = () => {
  return (
    <header className="bg-primary text-white p-4 text-xl">
      <nav className="container mx-auto flex justify-center items-center space-x-7">
        {/* Use space-x-4 for consistent spacing between all elements */}
        <img src={logo} alt="Logo" className="h-10 w-auto mr-5" />
        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>

        <Link to="/shop" className="hover:text-gray-300">
          Products
        </Link>

        <Link to="/createtickets" className="hover:text-gray-300">
          Help
        </Link>
      </nav>
    </header>
  );
};

export default Header;

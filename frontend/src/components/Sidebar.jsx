import { FaCog, FaHome } from 'react-icons/fa';

const Sidebar = () => (
  <nav className="flex gap-6 items-center justify-center mb-6">
    <a href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-lg">
      <FaHome /> Dashboard
    </a>
    <a href="/settings" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-lg">
      <FaCog /> Setting
    </a>
  </nav>
);

export default Sidebar; 
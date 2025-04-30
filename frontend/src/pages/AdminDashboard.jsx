import { useNavigate } from "react-router-dom";
import { FiBox, FiLogOut, FiUser } from "react-icons/fi"; // react-icons for icons

const AdminDashboard = () => {
  const navigate = useNavigate();

  const buttons = [
    { label: "Products", path: "/products", icon: <FiBox size={32} /> },
    // Add more buttons here as needed
  ];

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white rounded-full p-2">
              <FiUser size={28} />
            </span>
            <h1 className="text-3xl font-bold text-blue-800 tracking-tight">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 shadow hover:scale-105 active:scale-95"
          >
            <FiLogOut size={20} />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {buttons.map((button, index) => (
            <div
              key={index}
              onClick={() => handleButtonClick(button.path)}
              className="bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer flex flex-col items-center justify-center text-center hover:bg-blue-600 hover:text-white transform hover:-translate-y-1 hover:scale-105"
            >
              <span className="mb-3 text-blue-600 hover:text-white transition">{button.icon}</span>
              <span className="text-xl font-bold tracking-wide">{button.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

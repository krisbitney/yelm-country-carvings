import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the current path is the dashboard
  const isDashboard =
    location.pathname === '/admin' || location.pathname === '/admin/' || location.pathname === '/';

  // Handle back button click
  const handleBack = () => {
    if (isDashboard) {
      // If on dashboard, go to the main website
      window.location.href = '/';
    } else {
      // Otherwise, go back to the admin dashboard
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E9] flex flex-col">
      {/* Header */}
      <header className="bg-[#4A6151] text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 hover:text-gray-200 transition-colors duration-300"
              aria-label={isDashboard ? 'Go to website' : 'Go to dashboard'}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 className="font-['Cinzel'] text-2xl font-bold">{title}</h1>
          </div>
          <div className="flex items-center">
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-md transition-colors duration-300 mr-2 ${
                isDashboard
                  ? 'bg-[#3D5142] text-white cursor-default'
                  : 'hover:bg-[#3D5142] text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/events"
              className={`px-4 py-2 rounded-md transition-colors duration-300 mr-2 ${
                location.pathname.includes('/admin/events')
                  ? 'bg-[#3D5142] text-white cursor-default'
                  : 'hover:bg-[#3D5142] text-white'
              }`}
            >
              Events
            </Link>
            <Link
              to="/admin/gallery"
              className={`px-4 py-2 rounded-md transition-colors duration-300 mr-2 ${
                location.pathname.includes('/admin/gallery')
                  ? 'bg-[#3D5142] text-white cursor-default'
                  : 'hover:bg-[#3D5142] text-white'
              }`}
            >
              Gallery
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-[#B87351] text-white rounded-md hover:bg-[#A07E5D] transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-[#3E3C3B] text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="font-['Lato']">
            &copy; {new Date().getFullYear()} Yelm Country Carvings - Admin Portal
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;

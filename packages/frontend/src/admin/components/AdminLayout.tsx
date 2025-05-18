import React, { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * AdminLayout component that wraps admin pages with AuthProvider and ToastContainer
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      {/* Toast notifications container for admin routes */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {children}
    </AuthProvider>
  );
};

export default AdminLayout;
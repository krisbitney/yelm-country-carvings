import { Routes, Route, Navigate } from 'react-router-dom';
import MainWebsite from './landing-page/MainWebsite.tsx';
import AdminLayout from './admin/components/AdminLayout';
import ProtectedRoute from './admin/components/ProtectedRoute';
import LoginPage from './admin/pages/LoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import EventsPage from './admin/pages/EventsPage';
import GalleryPage from './admin/pages/GalleryPage';

/**
 * Main App component that handles routing for the entire application
 */
function App() {
  return (
    <Routes>
      {/* Main website route */}
      <Route path="/" element={<MainWebsite />} />

      {/* Admin login page */}
      <Route 
        path="/admin/login" 
        element={
          <AdminLayout>
            <LoginPage />
          </AdminLayout>
        } 
      />

      {/* Protected admin dashboard */}
      <Route 
        path="/admin" 
        element={
          <AdminLayout>
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          </AdminLayout>
        } 
      />

      {/* Protected admin events page */}
      <Route 
        path="/admin/events" 
        element={
          <AdminLayout>
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          </AdminLayout>
        } 
      />

      {/* Protected admin gallery page */}
      <Route 
        path="/admin/gallery" 
        element={
          <AdminLayout>
            <ProtectedRoute>
              <GalleryPage />
            </ProtectedRoute>
          </AdminLayout>
        } 
      />

      {/* Redirect any other admin routes to the admin dashboard */}
      <Route 
        path="/admin/*" 
        element={
          <Navigate to="/admin" replace />
        } 
      />
    </Routes>
  );
}

export default App;

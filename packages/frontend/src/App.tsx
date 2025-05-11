import { Routes, Route } from 'react-router-dom';
import MainWebsite from './MainWebsite';
import AdminRoutes from './admin/AdminRoutes';

/**
 * Main App component that handles routing for the entire application
 */
function App() {
  return (
    <Routes>
      {/* Main website route */}
      <Route path="/" element={<MainWebsite />} />

      {/* Admin routes are handled by the AdminRoutes component */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}

export default App;

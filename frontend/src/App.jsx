/**
 * App Component
 * Root component with route definitions, layout, and protected routes.
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import NotificationToast from './components/NotificationToast';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import TaskManager from './pages/TaskManager';
import MapView from './pages/MapView';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <main>{children}</main>
      <NotificationToast />
    </div>
  );
}

export default function App() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        isAuthenticated
          ? <Navigate to={user?.role === 'admin' ? '/admin' : '/volunteer'} replace />
          : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated
          ? <Navigate to={user?.role === 'admin' ? '/admin' : '/volunteer'} replace />
          : <Register />
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin']}>
          <AppLayout><AdminDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute roles={['admin']}>
          <AppLayout><TaskManager /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Volunteer routes */}
      <Route path="/volunteer" element={
        <ProtectedRoute roles={['volunteer']}>
          <AppLayout><VolunteerDashboard /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Shared routes */}
      <Route path="/map" element={
        <ProtectedRoute>
          <AppLayout><MapView /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="*" element={
        <Navigate to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/volunteer') : '/login'} replace />
      } />
    </Routes>
  );
}

/**
 * ProtectedRoute
 * Route guard that checks authentication and optional role requirements.
 * Redirects unauthenticated users to /login.
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="spinner"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (roles && !roles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/volunteer'} replace />;
  }

  return children;
}

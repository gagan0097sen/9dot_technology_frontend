import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

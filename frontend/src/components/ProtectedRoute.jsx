import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // 1. While checking auth status, show a loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1216] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6FFFB0]"></div>
      </div>
    );
  }

  // 2. If user is logged in, show the child route (Outlet)
  // 3. If not, redirect to login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
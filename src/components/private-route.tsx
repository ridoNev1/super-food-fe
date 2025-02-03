import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  isAuthenticated: boolean;
}

export default function PrivateRoute({ isAuthenticated }: PrivateRouteProps) {
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

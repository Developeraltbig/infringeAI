import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentUser } from "../features/auth/authSlice";

const GuestLayout = () => {
  const user = useSelector(selectCurrentUser);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestLayout;

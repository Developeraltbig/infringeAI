import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentUser } from "../features/auth/authSlice";

const GuestLayout = () => {
  const user = useSelector(selectCurrentUser);

  // If user exist, they shouldn't be on the login page
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, let them see the login/register page
  return <Outlet />;
};

export default GuestLayout;

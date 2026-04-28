import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentUser } from "../features/auth/authSlice";

const ProtectedLayout = () => {
  const user = useSelector(selectCurrentUser);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Uncomment when isEmailVerified is added to DB schema
  // const centralAppURL = import.meta.env.VITE_PATSERO_FRONTEND_URL;
  // if (!user?.isEmailVerified) {
  //   window.location.href = `${centralAppURL}/verify-email`;
  //   return null;
  // }

  return <Outlet />; // ✅ removed unnecessary <> wrapper
};

export default ProtectedLayout;

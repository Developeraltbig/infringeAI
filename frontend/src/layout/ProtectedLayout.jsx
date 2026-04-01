import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentUser } from "../features/auth/authSlice";
import Sidebar from "../components/Sidebar";

const ProtectedLayout = () => {
  const user = useSelector(selectCurrentUser);
  const centralAppURL = import.meta.env.VITE_PATSERO_FRONTEND_URL;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user && !user?.isEmailVerified) {
    window.location.href = `${centralAppURL}/verify-email`;
    return null;
  }

  return (
    <div>
      {/* <Sidebar /> */}
      <div>
        <main>
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;

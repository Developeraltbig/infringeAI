import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentUser } from "../features/auth/authSlice";

const ProtectedLayout = () => {
  const user = useSelector(selectCurrentUser);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user && !user?.isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
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

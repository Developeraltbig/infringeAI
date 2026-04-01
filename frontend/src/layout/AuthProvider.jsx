// 






















import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logOut,
  selectCurrentUser,
  setCredentials,
} from "../features/auth/authSlice";
import { persistor } from "../app/store";
import { useCheckAuthQuery } from "../features/auth/authApiSlice";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const persistedUser = useSelector(selectCurrentUser);

  // Runs on app load (sends HttpOnly cookie automatically)
  const {
    data,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    isUninitialized,
  } = useCheckAuthQuery();

  // Combine all loading states
  const isAuthChecking = isLoading || isFetching || isUninitialized;

  useEffect(() => {
    if (isSuccess && data) {
      const serverUser = data?.data?.user;

      // 🔒 Security check: mismatch between persisted and server user
      if (
        serverUser &&
        persistedUser &&
        persistedUser?._id !== serverUser?._id
      ) {
        dispatch(logOut());
        persistor.purge();
        return;
      }

      // ✅ Set fresh credentials from server
      dispatch(
        setCredentials({
          user: serverUser,
        })
      );
    }

    // ❌ If auth fails, clear everything
    if (isError) {
      dispatch(logOut());
      persistor.purge();
    }
  }, [isSuccess, isError, data, dispatch, persistedUser]);

  // ⏳ Block rendering until auth check completes
  if (isAuthChecking) {
    return (
      <div className="loader-container">
        <div className="spinner" />
        <p>Checking authorization...</p>
      </div>
    );
  }

  // ✅ Render app after auth check
  return children;
};

export default AuthProvider;
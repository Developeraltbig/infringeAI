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

  const { data, isLoading, isFetching, isSuccess, isError, isUninitialized } =
    useCheckAuthQuery();

  const isAuthChecking = isLoading || isFetching || isUninitialized;

  useEffect(() => {
    if (isSuccess && data) {
      const serverUser = data?.data?.user;

      // 🔒 Mismatch between persisted and server user → force logout
      if (
        serverUser &&
        persistedUser &&
        persistedUser?._id !== serverUser?._id
      ) {
        dispatch(logOut());
        persistor.purge();
        return;
      }

      // ✅ Sync fresh user from server into Redux
      dispatch(setCredentials({ user: serverUser }));
    }

    if (isError) {
      dispatch(logOut());
      persistor.purge();
    }
  }, [isSuccess, isError, data, dispatch, persistedUser]);

  // ⏳ Block render until auth check completes
  if (isAuthChecking) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-3 text-gray-500">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#ff6b00] rounded-full animate-spin" />
        <p className="text-sm font-medium">Checking authorization...</p>
      </div>
    );
  }

  return children;
};

export default AuthProvider;

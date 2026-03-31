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

  // This automatically runs when the app loads.
  // It sends the HttpOnly cookie to the backend.
  const { data, isLoading, isSuccess } = useCheckAuthQuery();

  useEffect(() => {
    if (isSuccess && data) {
      const serverUser = data?.data?.user;

      // THE CRITICAL CHECK
      if (
        serverUser &&
        persistedUser &&
        persistedUser?._id !== serverUser?._id
      ) {
        // Perform a hard reset of the client's state for security.
        dispatch(logOut());
        persistor.purge(); // Clear the corrupted redux-persist storage
        return;
      }

      dispatch(
        setCredentials({
          user: serverUser,
        }),
      );
    }
  }, [isSuccess, data, dispatch]);

  if (isLoading) {
    return <div className="loader-container">Authorization Check</div>;
  }

  // Once loading is done (whether success or error), render the app
  return children;
};

export default AuthProvider;

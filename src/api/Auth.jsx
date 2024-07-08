import { Navigate } from "react-router-dom";

export const AuthorizeUser = ({ children }) => {
  const token = localStorage.getItem("firstLogin");
  if (!token) {
    return <Navigate to={"/admin/login"} replace={true}></Navigate>;
  }

  return children;
};

export const ProtectRoute = ({ children }) => {
  const username = useAuthStore.getState().auth.username;
  if (!username) {
    return <Navigate to={"/admin"} replace={true}></Navigate>;
  }
  return children;
};

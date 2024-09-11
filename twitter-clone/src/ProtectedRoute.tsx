import { ReactNode, useEffect } from "react";
import { useAuth } from "./store/auth-context";
import { useNavigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { loggedInUser } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!loggedInUser) {
        navigate("/login");
      }
    },
    [loggedInUser, navigate]
  );

  return <>{children}</>;
};
export default ProtectedRoute;

import { User } from "../Signup";
import { ReactNode, useContext, useState, createContext } from "react";

type AuthContextType = {
  loggedInUser: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (user: User) => {
    setLoggedInUser(user);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  };

  const logout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
  };

  return (
    <AuthContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContextProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("must be used with AuthContextProvider");
  }
  return context;
};

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./Home";
import LoginPage from "./Login";
import SignupPage from "./Signup";
import AuthContextProvider from "./store/auth-context";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    index: true,
    element: (
      <ProtectedRoute>
        <HomePage></HomePage>
      </ProtectedRoute>
    ),
  },
  { path: "login", element: <LoginPage></LoginPage> },
  { path: "signup", element: <SignupPage></SignupPage> },
]);

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./Home";
import LoginPage from "./Login";
import SignupPage from "./Signup";

const router = createBrowserRouter([
  { index: true, element: <HomePage></HomePage> },
  { path: "login", element: <LoginPage></LoginPage> },
  { path: "signup", element: <SignupPage></SignupPage> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./store/auth-context";

export default function Login() {
  const [username, setUsername] = useState("");
  //   const [password, setPassword] = useState(""); do i need this to be state here?
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/users/${username}`);

      if (response.status === 200) {
        const user = await response.json();

        login(user);
        navigate("/");
        console.log("User logged in:", user);
      } else if (response.status === 404) {
        console.error("Login failed: User not found");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="flex-center">Log in</h2>

        <input
          id="username"
          type="text"
          name="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        ></input>

        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          required
        ></input>

        <button className="button">Log in</button>
      </form>

      <div className="flex-center margin-sm">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}

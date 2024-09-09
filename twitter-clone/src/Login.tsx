import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  //   const [password, setPassword] = useState(""); do i need this to be state here?

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/users/${username}`);

      if (response.status === 200) {
        const user = await response.json();

        localStorage.setItem("loggedInUser", JSON.stringify(user));

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
        ></input>

        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
        ></input>

        <button className="button">Log in</button>
      </form>

      <div className="flex-center margin-sm">
        Don't have an account? Sign up
      </div>
    </div>
  );
}

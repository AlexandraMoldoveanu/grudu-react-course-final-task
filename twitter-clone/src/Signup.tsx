import { Link, useNavigate } from "react-router-dom";

export type User = {
  id: string;
  name: string;
  email: string;
  initials?: string;
};
export const getInitials = (name: any) => {
  if (!name) {
    return "";
  }

  const initials = name
    .split(" ")
    .reduce(
      (result: string, currentWord: string) =>
        result + currentWord[0].toUpperCase(),
      ""
    );

  return initials;
};

export default function Signup() {
  const navigate = useNavigate();

  async function handleSubmit(e: any) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.username,
          name: data.fullname,
          email: data.email,
          initials: getInitials(data.fullname),
        }),
      });

      if (response.ok) {
        const user: User = await response.json();
        console.log("Signup successful, user authenticated:", user);

        navigate("/login");
      } else {
        console.error("Signup failed", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="flex-center">Sign up</h2>
        <input id="email" type="email" name="email" placeholder="Email"></input>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
        ></input>

        <input
          id="username"
          type="text"
          name="username"
          //   onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        ></input>
        <input
          id="fullname"
          type="text"
          name="fullname"
          //   onChange={(e) => setUsername(e.target.value)}
          placeholder="Full name"
        ></input>
        <button className="button">Sign up</button>
      </form>

      <div className="flex-center margin-sm">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}

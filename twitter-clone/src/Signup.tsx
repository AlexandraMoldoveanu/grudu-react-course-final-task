import { Link, useNavigate } from "react-router-dom";
import {
  isEmail,
  isNotEmpty,
  hasMinLength,
  hasMaxLength,
} from "./util/validation";
import { useState } from "react";

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
  const [didEdit, setDidEdit] = useState({
    email: false,
    password: false,
    username: false,
    fullname: false,
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    username: "",
    fullname: "",
  });

  function handleInputBlur(identifier: string, value: string) {
    setDidEdit((prevState) => ({
      ...prevState,
      [identifier]: true,
    }));
    validateField(identifier, value);
  }

  function validateField(field: string, value: string) {
    let error = "";

    if (field === "email") {
      if (!isEmail(value) || !isNotEmpty(value)) {
        error = "Please enter a valid email";
      }
    } else if (field === "password") {
      if (!hasMinLength(value, 8)) {
        error = "Password must be at least 8 characters";
      } else if (!hasMaxLength(value, 256)) {
        error = "Password must not exceed 256 characters";
      }
    } else if (field === "username") {
      if (!isNotEmpty(value)) {
        error = "Username cannot be empty";
      }
    } else if (field === "fullname") {
      if (!hasMinLength(value, 1)) {
        error = "Full name must be at least 1 character";
      } else if (!hasMaxLength(value, 512)) {
        error = "Full name cannot exceed 512 characters";
      }
    }

    setFormErrors((prevState) => ({
      ...prevState,
      [field]: error,
    }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const formIsValid =
      !formErrors.email &&
      !formErrors.password &&
      !formErrors.username &&
      !formErrors.fullname;

    if (!formIsValid) {
      return;
    }

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
        e.target.reset();
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
        <div>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            required
            onBlur={(e) => handleInputBlur("email", e.target.value)}
          ></input>
          {didEdit.email && formErrors.email && (
            <div className="input-error">{formErrors.email}</div>
          )}
        </div>

        <div>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            required
            onBlur={(e) => handleInputBlur("password", e.target.value)}
          />
          {didEdit.password && formErrors.password && (
            <div className="input-error">{formErrors.password}</div>
          )}
        </div>

        <div>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            required
            onBlur={(e) => handleInputBlur("username", e.target.value)}
          />
          {didEdit.username && formErrors.username && (
            <div className="input-error">{formErrors.username}</div>
          )}
        </div>

        <div>
          <input
            id="fullname"
            type="text"
            name="fullname"
            placeholder="Full name"
            required
            onBlur={(e) => handleInputBlur("fullname", e.target.value)}
          />
          {didEdit.fullname && formErrors.fullname && (
            <div className="input-error">{formErrors.fullname}</div>
          )}
        </div>

        <button className="button">Sign up</button>
      </form>

      <div className="flex-center margin-sm">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}

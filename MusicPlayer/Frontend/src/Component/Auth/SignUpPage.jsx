import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://music-eight-alpha.vercel.app/api/v1/auth/signup", {
        email,
        password,
      })
      .then((res) => {
        toast.success(res.data.message);
        if (res.data.token) {
          navigate("/");
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };
  return (
    <div className="signin-container">
      <div className="signin-form">
        <h1 className="signin-heading">Sign Up</h1>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="signin-input"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="signin-input"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button
            type="submit"
            className="signin-button"
            onClick={handleSubmit}
          >
            Sign Up
          </button>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <span></span>
            <span>
              If already have an account <a href="/">Sign In</a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;

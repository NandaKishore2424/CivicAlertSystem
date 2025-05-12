import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signinUser, signinOfficial } from "../login/Api";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // "user" or "official"
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = { email, password };
      const data = role === "official"
        ? await signinOfficial(formData)
        : await signinUser(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/5088017/pexels-photo-5088017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center mb-4">
          <img
            src="https://img.icons8.com/?size=100&id=ie6nIMVxKs0a&format=png&color=000000"
            alt="GitHub Logo"
            className="w-20 h-20 mx-auto"
          />
        </div>
        <h2 className="text-center text-xl font-semibold mb-4">Sign in to QuizHub</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Role Dropdown */}
          <label className="block text-sm font-medium">Login as</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded p-2 mt-1 mb-4"
          >
            <option value="user">Normal User</option>
            <option value="official">Official</option>
          </select>

          {/* Email Input */}
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border rounded p-2 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

          {/* Password Input */}
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border rounded p-2 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded text-lg font-medium hover:bg-gray-900 transition"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-4">
          <p className="text-sm">
            New to QuizHub?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Create an account.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

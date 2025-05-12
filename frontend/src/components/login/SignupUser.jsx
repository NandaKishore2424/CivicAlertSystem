import React, { useState } from "react";
import { signupUser } from "../login/Api.js";
import { Link, useNavigate } from "react-router-dom";

const SignupUser = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phoneNumber: "",    // Add phoneNumber field
    location: "",       // Add location field
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await signupUser(formData);
      setSuccess("Account created successfully! Redirecting to Sign In...");
      console.log(response);

      // Redirect to Sign In after 2 seconds
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Background Image */}
      <div
        className="hidden md:flex w-1/2 bg-black text-white flex-col justify-center items-center p-10"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1036372/pexels-photo-1036372.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-4xl font-bold mb-4">Create your free account</h1>
        <p className="text-lg">A hub for all your quizzes.</p>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Sign up to QuizHub</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          <form onSubmit={handleSignup}>
            {/* Email Input */}
            <label className="block text-sm font-medium">Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border rounded p-2 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />

            {/* Password Input */}
            <label className="block text-sm font-medium">Password*</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border rounded p-2 mt-1 mb-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
            <p className="text-xs text-gray-500 mb-4">
              Password should be at least 8 characters including a number and a lowercase letter.
            </p>

            {/* Username Input */}
            <label className="block text-sm font-medium">Username*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Username"
              className="w-full border rounded p-2 mt-1 mb-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
            <p className="text-xs text-gray-500 mb-4">
              Username may only contain alphanumeric characters or single hyphens.
            </p>

            {/* Phone Number Input */}
            <label className="block text-sm font-medium">Phone Number*</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border rounded p-2 mt-1 mb-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />

            {/* Location Input */}
            <label className="block text-sm font-medium">Location*</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full border rounded p-2 mt-1 mb-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded text-lg font-medium hover:bg-gray-900 transition"
            >
              Continue → 
            </button>
          </form>

          {/* Government Professional Button */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-700">
              If you are a government professional, 
              <Link to="/signupofficial" className="text-blue-500 hover:underline ml-1">
                use this form.
              </Link>
            </p>
          </div>

          {/* Sign in Link */}
          <p className="mt-4 text-sm text-right">
            Already have an account? <Link to="/signin"><span className="text-blue-500 cursor-pointer">Sign in →</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupUser;

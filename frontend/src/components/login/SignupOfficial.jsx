import React, { useState, useEffect } from "react";
import { signupUser } from "./Api.js"; // Uncomment and use API when required
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignupOfficial = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    role: "official",
    status: "pending",
    proof: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            location: `${latitude},${longitude}`,
          }));
        },
        (err) => {
          console.log("Location error:", err);
          setFormData((prev) => ({
            ...prev,
            location: "Location not available",
          }));
        }
      );
    } else {
      setFormData((prev) => ({
        ...prev,
        location: "Geolocation not supported",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "proof") {
      setFormData({ ...formData, proof: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Password validation function
  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Password and confirm password check
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    // Password strength check
    if (!validatePassword(formData.password)) {
      return setError(
        "Password must be at least 8 characters, containing a number and a lowercase letter."
      );
    }

    try {
      const submission = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submission.append(key, value);
      });

      // Uncomment and use the signup API
      await signupUser(submission);

      setSuccess("Signup successful. Wait for admin approval.");
      setTimeout(() => navigate("/signin"), 3000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Background Image */}
      <div
        className="hidden md:flex w-1/2 bg-black text-white flex-col justify-center items-center p-10"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1036372/pexels-photo-1036372.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-4xl font-bold mb-4">Create your official account</h1>
        <p className="text-lg">For managing official activities and quizzes.</p>
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

            {/* Confirm Password Input */}
            <label className="block text-sm font-medium">Confirm Password*</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full border rounded p-2 mt-1 mb-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />

            {/* Phone Number Input */}
            <label className="block text-sm font-medium">Phone Number*</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border rounded p-2 mt-1 mb-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />

            {/* File Input */}
            <label className="block text-sm font-medium">Proof*</label>
            <input
              type="file"
              name="proof"
              accept=".pdf,.jpg,.png"
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
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

          {/* Sign in Link */}
          <p className="mt-4 text-sm text-right">
            Already have an account?{" "}
            <Link to="/signin">
              <span className="text-blue-500 cursor-pointer">Sign in →</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupOfficial;

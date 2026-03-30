import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const { loading, handleRegister } = useAuth();



  const handleSubmit = async(e) => {
    e.preventDefault();
    await handleRegister({ username, email, password });
    navigate("/")
  };

  if (loading) {
    return <h1>Loading....</h1>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center px-4 py-12">
      {/* Header Section */}
      <div className="max-w-2xl w-full mb-8 text-center">
        <div className="inline-block mb-6">
          <div className="text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-green-400 bg-clip-text text-transparent animate-pulse">
            🎯 InterviewAI
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Start Your Journey</h2>
        <p className="text-gray-300 text-lg mb-2">
          Join thousands of professionals mastering their interview skills
        </p>
        <p className="text-gray-400 text-sm">
          Get access to AI-powered practice sessions tailored to your needs
        </p>
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <div>
            <p className="text-blue-400 font-semibold">100+ Questions</p>
            <p className="text-gray-400">Practice variety</p>
          </div>
          <div>
            <p className="text-purple-400 font-semibold">AI Feedback</p>
            <p className="text-gray-400">Real-time guidance</p>
          </div>
          <div>
            <p className="text-green-400 font-semibold">24/7 Available</p>
            <p className="text-gray-400">Learn anytime</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join us today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Create a password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

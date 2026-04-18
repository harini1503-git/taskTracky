// src/components/Signup.jsx
import React, { useState, useContext } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { validEmail, validPassword } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");

  // const handlePasswordChange =(e)=>{
  //         const value = e.target.value;
  //         setPassword(value);
  //         const strongPasswordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  //         if(!strongPasswordRegex.test(value)){
  //             setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
  //         }else{
  //             setError('');
  //         }
  //     };

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!validEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validPassword(password) && password != "") {
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }

    //Signup API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name,
        email,
        password,
        adminInviteToken,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
      }
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/userDashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <AuthLayout
      title="Create your Account"
      subtitle="Join us and connect with every application"
    >
      <img
        src="https://www.w3schools.com/howto/img_avatar.png"
        alt="Avatar"
        className="w-18 h-18 rounded-full object-cover border-2 border-blue-500 flex items-center justify-center mx-auto mb-2"
      />

      <form className="space-y-4" onSubmit={handleSignUp}>
        <div>
          <label htmlFor="text">Full Name</label>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex space-x-4">
          {/* Password Field */}
          <div className="w-1/2">
            <label htmlFor="password" className="block">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Admin Invite Token Field */}
          <div className="w-1/2">
            <label htmlFor="adminToken" className="block">
              Admin Invite Token
            </label>
            <input
              type="text"
              placeholder="6 Digit Token"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-2"
              value={adminInviteToken}
              onChange={(e) => setAdminInviteToken(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out cursor-pointer"
        >
          Sign Up
        </button>

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <div className="text-center text-sm text-gray-600 mt-2">
          Or Continue with
        </div>
        <div className="flex gap-4 mb-6">
          <button className="flex items-center justify-center gap-2 border w-1/2 py-2 rounded-lg hover:bg-gray-50">
            <FcGoogle size={20} /> Google
          </button>
          <button className="flex items-center justify-center gap-2 border w-1/2 py-2 rounded-lg hover:bg-gray-50">
            <FaFacebook color="#1877F2" size={20} /> Facebook
          </button>
        </div>

        <div className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            className="text-blue-600 underline font-semibold text-1xl"
            to="/login"
          >
            Log in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;

import { React, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { validEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const [rememberMe, setRememberMe] = useState(false);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  //Handles the Login Form Submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }

    //Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;
      console.log(token);
      console.log(response.data);

      if (token) {
        localStorage.setItem("token", token);
        // console.log("before updateUser");
        updateUser(response.data);
        // console.log("breaking updateUser")

        //Redirect to DashBoard
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/userDashboard");
        }
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
      title="Log in to your Account"
      subtitle="Welcome back! Select method to log in:"
    >
      <div className="flex gap-4 mb-6">
        <button className="flex items-center justify-center gap-2 border w-1/2 py-2 rounded-lg hover:bg-gray-50">
          <FcGoogle size={20} /> Google
        </button>
        <button className="flex items-center justify-center gap-2 border w-1/2 py-2 rounded-lg hover:bg-gray-50">
          <FaFacebook color="#1877F2" size={20} /> Facebook
        </button>
      </div>

      <div className="text-center text-sm text-gray-400 mb-4">
        or continue with email
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter your Email id"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Enter the Password"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
            />{" "}
            Remember me
          </label>
          <a href="#" className="text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out cursor-pointer"
        >
          Log in
        </button>

        <div className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            className="text-blue-600 underline font-semibold text-1xl"
            to="/signup"
          >
            Create an Account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;

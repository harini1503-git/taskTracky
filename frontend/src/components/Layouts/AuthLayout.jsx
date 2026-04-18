// src/components/AuthLayout.jsx
import React from "react";
import Login_bg from "../../assets/Login_bg.png";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <>
      <div className="flex bg-gray-100 min-h-screen">
        {/* Left Section - Form */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white px-8 md:px-20">
          <h1 className="text-start text-blue-600 text-3xl font-semibold mb-4 w-full max-w-md">Task Manager</h1>
          <div className="w-full max-w-md">
            {title && (
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
            )}

            {children}
          </div>
        </div>

        {/* Right Section - Illustration */}
        <div
          className="hidden md:flex flex-col justify-center items-center w-[50%] bg-cover bg-center text-white p-10"
          style={{ backgroundImage: `url(${Login_bg})` }}
        >
          <div className="p-8 rounded-2xl w-full h-full flex flex-col justify-end items-center mt-10">
            <h3 className="text-2xl font-semibold mb-2">
              Connect with every application.
            </h3>
            <p className="text-sm text-blue-100">
              Everything you need in an easily customizable dashboard.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;

import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const useUserAuth = () => {
  const { user, loading, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Wait until loading is done
    if (loading) return;

    // 🔹 If user exists, stay on the page
    if (user) return;

    // 🔹 If no user after loading, redirect to login
    clearUser();
    navigate("/login");
  }, [user, loading, clearUser, navigate]);
};

export default useUserAuth;
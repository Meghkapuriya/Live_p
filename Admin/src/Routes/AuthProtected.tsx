import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";

const AuthProtected = ({ children }: any) => {
  const location = useLocation();

  const authUser = sessionStorage.getItem("authUser");
  const token = authUser ? JSON.parse(authUser)?.token : null;

  useEffect(() => {
    if (token) {
      setAuthorization(token);
    }
  }, [token]);

  // ✅ ALLOW OTP PAGE ALWAYS
  if (location.pathname === "/verify-otp") {
    return <>{children}</>;
  }

  // ✅ TEMP: DO NOT FORCE LOGIN REDIRECT
  // (abhi ke liye route lock completely band)
  return <>{children}</>;
};

export default AuthProtected;

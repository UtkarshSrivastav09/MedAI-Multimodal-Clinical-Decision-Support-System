import { useState } from "react";
import API_BASE_URL from "../api";

const useAuth = () => {
  const [error, setError] = useState("");

  const register = async (username, email, password, organization) => {
    try {
      setError("");
      
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, organization }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        let errMsg = "Registration failed";
        if (data.detail) {
          errMsg = typeof data.detail === "string" ? data.detail : (Array.isArray(data.detail) ? data.detail[0].msg : JSON.stringify(data.detail));
        }
        setError(errMsg);
        return false;
      }
      
      const data = await res.json();
      sessionStorage.setItem("organization", data.organization);
      sessionStorage.setItem("username", data.username);
      
      return true;
    } catch (err) {
      setError("Unable to connect to Server API.");
      return false;
    }
  };

  const login = async (username, password) => {
    try {
      setError("");
      
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        let errMsg = "Invalid username or password";
        if (data.detail) {
          errMsg = typeof data.detail === "string" ? data.detail : (Array.isArray(data.detail) ? data.detail[0].msg : JSON.stringify(data.detail));
        }
        setError(errMsg);
        return false;
      }
      
      const data = await res.json();
      sessionStorage.setItem("organization", data.organization);
      sessionStorage.setItem("username", data.username);
      
      return true;
    } catch (err) {
      setError("Unable to connect to Server API.");
      return false;
    }
  };

  return { register, login, error };
};

export default useAuth;
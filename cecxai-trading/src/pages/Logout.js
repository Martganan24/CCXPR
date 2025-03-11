import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token or any session data
    localStorage.removeItem("authToken"); // ✅ Remove token to log the user out

    // Redirect to the main frontend page
    window.location.href = "https://ceccxai-frontend-b334232d6e3e.herokuapp.com/"; // Redirect to main page
  }, [navigate]);

  return <h1>Logging out...</h1>;
}

export default Logout;
c
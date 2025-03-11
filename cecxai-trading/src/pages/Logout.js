import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user session (Example: localStorage.removeItem("user"))
    navigate("/login"); // Redirect to login page
  }, [navigate]);

  return <h1>Logging out...</h1>;
}

export default Logout;

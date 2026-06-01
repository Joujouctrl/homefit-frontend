import React from "react";
import Login from "./Login";
import { loginUser } from "../Services/authService";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {

  const navigate = useNavigate(); 

  const handleLogin = async (data) => {
    try {
      const res = await loginUser(data);

      //  stockage du token et role
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.user.role);
      console.log("USER =", res.user);
      localStorage.setItem("userName", res.user.name);

      // pour debug
      console.log("ROLE =", res.user.role);

      // redirection vers home
      navigate("/");

    } catch (err) {
      console.log(err);
      alert("Erreur de connexion");
    }
  };

  return <Login onLogin={handleLogin} />;
}
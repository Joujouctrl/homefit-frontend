import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Remplir tous les champs");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log(data);

      //  save data
      localStorage.setItem("userId", data.user.id); 
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("userName", data.user.name);
      // redirection selon le rôle
      const role = data.user.role;
      if (role === "admin") navigate("/dashboard");
      else if (role === "technicien") navigate("/Technicien");
      else navigate("/appartements");
      //  redirect
      navigate("/");
    } catch (err) {
      console.log("ERROR:", err);
      alert("Erreur de connexion. Vérifiez vos identifiants.");
    }
  };

  return (
    <div 
      className="login-container" 
      style={{ 
        padding: "140px 20px 60px 20px", 
        minHeight: "80vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        fontFamily: "'Segoe UI', sans-serif" 
      }}
    >
      <form 
        className="login-card" 
        onSubmit={handleLogin}
        style={{ 
          backgroundColor: "#FAF6F0", 
          padding: "40px", 
          borderRadius: "16px", 
          border: "1px solid #E6DFD3", 
          boxShadow: "0px 10px 25px rgba(163, 144, 129, 0.1)", 
          width: "100%", 
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          textAlign: "left"
        }}
      >
        {/* 🌟 Titre en Marron Sombre */}
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <h2 style={{ color: "#4E342E", fontSize: "28px", fontWeight: "bold", margin: "0 0 8px 0" }}>
            Welcome Back
          </h2>
          <p style={{ color: "#9E8A78", margin: 0, fontSize: "14px" }}>
            Connectez-vous à votre espace HomeFit
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ color: "#4E342E", fontWeight: "600", fontSize: "14px" }}>Email</label>
          <input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #A39081", outline: "none", backgroundColor: "#FDFBF7", color: "#4E342E", fontSize: "14.5px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ color: "#4E342E", fontWeight: "600", fontSize: "14px" }}>Mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #A39081", outline: "none", backgroundColor: "#FDFBF7", color: "#4E342E", fontSize: "14.5px" }}
          />
        </div>

        {/* 🌟 Bouton Principal en Marron Clair (Footer) & Texte en Sombre */}
        <button 
          type="submit"
          style={{ backgroundColor: "#A39081", color: "#4E342E", border: "none", padding: "14px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "15px", marginTop: "10px", boxShadow: "0px 4px 12px rgba(163, 144, 129, 0.2)" }}
        >
          Se connecter
        </button>

        <p style={{ margin: "10px 0 0 0", textAlign: "center", color: "#9E8A78", fontSize: "14px" }}>
          Nouveau sur HomeFit ?{" "}
          <span onClick={() => navigate("/signup")} style={{ cursor: "pointer", color: "#4E342E", fontWeight: "bold", decoration: "underline" }}>
            Créer un compte
          </span>
        </p>
      </form>
    </div>
  );
}
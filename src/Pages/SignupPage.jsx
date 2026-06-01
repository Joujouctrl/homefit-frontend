import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); // ✅ role par défaut
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Remplir tous les champs");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }), // ✅ envoie le role
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Connecté automatiquement après inscription
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userName", data.user.name);

        alert("Compte créé avec succès !");

        // ✅ Redirection selon le rôle choisi
        if (data.user.role === "admin") navigate("/AdminReservations");
        else if (data.user.role === "technicien") navigate("/Technicien");
        else navigate("/appartements");

      } else {
        const firstError = Object.values(data.errors || {})[0]?.[0];
        alert(firstError || data.message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    }
  };

  return (
    <div
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
        onSubmit={handleSignup}
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
        {/* Titre */}
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <h2 style={{ color: "#4E342E", fontSize: "28px", fontWeight: "bold", margin: "0 0 8px 0" }}>
            Créer un compte
          </h2>
          <p style={{ color: "#9E8A78", margin: 0, fontSize: "14px" }}>
            Inscrivez-vous pour rejoindre l'expérience HomeFit
          </p>
        </div>

        {/* Nom */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ color: "#4E342E", fontWeight: "600", fontSize: "14px" }}>Nom complet</label>
          <input
            type="text"
            placeholder="Ex: Sarah Alami"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #A39081", outline: "none", backgroundColor: "#FDFBF7", color: "#4E342E", fontSize: "14.5px" }}
          />
        </div>

        {/* Email */}
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

        {/* Mot de passe */}
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

        {/*  Rôle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ color: "#4E342E", fontWeight: "600", fontSize: "14px" }}>Je suis un(e)</label>
          <div style={{ display: "flex", gap: "12px" }}>

            {/* Client */}
            <div
              onClick={() => setRole("client")}
              style={{
                flex: 1,
                padding: "14px 10px",
                borderRadius: "10px",
                border: `2px solid ${role === "client" ? "#4E342E" : "#E6DFD3"}`,
                backgroundColor: role === "client" ? "#4E342E" : "#FDFBF7",
                color: role === "client" ? "#FDFBF7" : "#4E342E",
                cursor: "pointer",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.2s"
              }}
            >
               Client
            </div>

            {/* Technicien */}
            <div
              onClick={() => setRole("technicien")}
              style={{
                flex: 1,
                padding: "14px 10px",
                borderRadius: "10px",
                border: `2px solid ${role === "technicien" ? "#4E342E" : "#E6DFD3"}`,
                backgroundColor: role === "technicien" ? "#4E342E" : "#FDFBF7",
                color: role === "technicien" ? "#FDFBF7" : "#4E342E",
                cursor: "pointer",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.2s"
              }}
            >
               Technicien
            </div>

          </div>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          style={{
            backgroundColor: "#A39081",
            color: "#4E342E",
            border: "none",
            padding: "14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "15px",
            marginTop: "10px",
            boxShadow: "0px 4px 12px rgba(163, 144, 129, 0.2)"
          }}
        >
          Créer mon compte
        </button>

        <p style={{ margin: "10px 0 0 0", textAlign: "center", color: "#9E8A78", fontSize: "14px" }}>
          Déjà un compte ?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer", color: "#4E342E", fontWeight: "bold", textDecoration: "underline" }}
          >
            Se connecter
          </span>
        </p>
      </form>
    </div>
  );
}
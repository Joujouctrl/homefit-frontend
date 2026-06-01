import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = async () => {
  const token = localStorage.getItem("token");
  try {
    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json",},
    });
  } catch (err) {
    console.error(err);
  } finally {
    localStorage.clear();
    navigate("/login");
  }
  };

  return (
    <nav className="navbar transparent">
      {/* LEFT — Logo */}
      <div className="logo-section">
        <img src="/Logo.png" alt="logo" className="logo-img" />
        <div className="logo">HomeFit</div>
      </div>

      {/* RIGHT — Links selon le rôle */}
      <div className="nav-links">

        {/* CLIENT */}
        {token && role === "client" && (
          <>
            <Link to="/">Accueil</Link>
            <Link to="/appartements">Appartements</Link>
            <Link to="/MyReservations">Mes Réservations</Link>
            <Link to="/chat">Messagerie</Link>
            <Link to="/ContactTechnicien">Réclamation</Link>
          </>
        )}

        {/*  TECHNICIEN */}
        {token && role === "technicien" && (
          <>
            <Link to="/">Accueil</Link>
            <Link to="/Technicien">Tableau de Bord</Link>
            <Link to="/chat">Messagerie</Link>
          </>
        )}

        {/*  ADMIN */}
        {token && role === "admin" && (
          <>
            <Link to="/">Accueil</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/appartements">Appartements</Link>
            <Link to="/AdminReservations">Gestion Réservations</Link>
            <Link to="/AdminTechniciens">Techniciens</Link>
          </>
        )}

        {/* NON CONNECTÉ */}
        {!token && (
          <>
            <Link to="/">Accueil</Link>
            <Link to="/appartements">Appartements</Link>
            <Link to="/login">Connexion</Link>
            <Link to="/signup">Inscription</Link>
          </>
        )}

        {/*  Bouton Déconnexion si connecté */}
        {token && (
          <button
            onClick={handleLogout}
            style={{backgroundColor: "transparent",border: "1px solid #A39081",color: "#4E342E", padding: "6px 16px", borderRadius: "20px",cursor: "pointer",
              fontWeight: "600",fontSize: "14px", fontFamily: "'Segoe UI', sans-serif"}}>Déconnexion 
          </button>
        )}
      </div>
    </nav>
  );
}
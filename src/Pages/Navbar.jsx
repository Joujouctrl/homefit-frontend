import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("https://homefit-backend-rjab.onrender.com/api/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar transparent">

      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none" }} onClick={closeMenu}>
        <div className="logo-section">
          <img src="/Logo.png" alt="logo" className="logo-img" />
          <div className="logo">HomeFit</div>
        </div>
      </Link>

      {/* Hamburger button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="hamburger-btn"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Links */}
      <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>

        {token && role === "client" && (
          <>
            <Link to="/" onClick={closeMenu}>Accueil</Link>
            <Link to="/appartements" onClick={closeMenu}>Appartements</Link>
            <Link to="/MyReservations" onClick={closeMenu}>Mes Réservations</Link>
            <Link to="/chat" onClick={closeMenu}>Messagerie</Link>
            <Link to="/ContactTechnicien" onClick={closeMenu}>Réclamation</Link>
          </>
        )}

        {token && role === "technicien" && (
          <>
            <Link to="/" onClick={closeMenu}>Accueil</Link>
            <Link to="/Technicien" onClick={closeMenu}>Tableau de Bord</Link>
            <Link to="/chat" onClick={closeMenu}>Messagerie</Link>
          </>
        )}

        {token && role === "admin" && (
          <>
            <Link to="/" onClick={closeMenu}>Accueil</Link>
            <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
            <Link to="/appartements" onClick={closeMenu}>Appartements</Link>
            <Link to="/AdminReservations" onClick={closeMenu}>Gestion Réservations</Link>
            <Link to="/AdminTechniciens" onClick={closeMenu}>Techniciens</Link>
          </>
        )}

        {!token && (
          <>
            <Link to="/" onClick={closeMenu}>Accueil</Link>
            <Link to="/appartements" onClick={closeMenu}>Appartements</Link>
            <Link to="/login" onClick={closeMenu}>Connexion</Link>
            <Link to="/signup" onClick={closeMenu}>Inscription</Link>
          </>
        )}

        {token && (
          <button
            onClick={() => { handleLogout(); closeMenu(); }}
            className="logout-btn"
          >
            Déconnexion
          </button>
        )}
      </div>
    </nav>
  );
}
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://homefit-backend-rjab.onrender.com";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: "120px 40px", color: "#9E8A78", fontFamily: "'Segoe UI', sans-serif" }}>Chargement...</div>;

  const cards = [
    { label: "Utilisateurs", value: stats?.users ?? 0, icon: "👥", color: "#E3F2FD", textColor: "#1565C0" },
    { label: "Réservations", value: stats?.reservations ?? 0, icon: "📅", color: "#F3E5F5", textColor: "#6A1B9A" },
    { label: "Revenus (DH)", value: stats?.revenus ?? 0, icon: "💰", color: "#E8F5E9", textColor: "#2E7D32" },
    { label: "Taux d'occupation", value: `${stats?.occupation ?? 0}%`, icon: "🏠", color: "#FFF3E0", textColor: "#EF6C00" },
  ];

  return (
    <div style={{ padding: "120px 40px 40px 40px", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Titre */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", color: "#4E342E", fontWeight: "bold", margin: "0 0 10px 0" }}>
          Tableau de Bord Admin
        </h1>
        <p style={{ color: "#9E8A78", margin: 0 }}>Vue globale de la plateforme HomeFit</p>
      </div>

      {/* ✅ Cards statistiques */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {cards.map((card, i) => (
          <div key={i} style={{ backgroundColor: card.color, padding: "24px", borderRadius: "16px", border: "1px solid #E6DFD3", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontSize: "32px" }}>{card.icon}</span>
            <span style={{ fontSize: "28px", fontWeight: "bold", color: card.textColor }}>{card.value}</span>
            <span style={{ fontSize: "14px", color: "#5A4B41", fontWeight: "600" }}>{card.label}</span>
          </div>
        ))}
      </div>

      {/* ✅ Raccourcis Admin */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "20px", color: "#4E342E", fontWeight: "700", margin: "0 0 20px 0" }}>
          Gestion rapide
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>

          <div
            onClick={() => navigate("/AdminReservations")}
            style={{ backgroundColor: "#FAF6F0", padding: "20px", borderRadius: "12px", border: "1px solid #E6DFD3", cursor: "pointer", textAlign: "center", transition: "box-shadow 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0px 4px 15px rgba(163,144,129,0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
          >
            <div style={{ fontSize: "30px", marginBottom: "8px" }}>📅</div>
            <div style={{ color: "#4E342E", fontWeight: "700", fontSize: "15px" }}>Réservations</div>
            <div style={{ color: "#9E8A78", fontSize: "13px", marginTop: "4px" }}>Valider / Refuser</div>
          </div>

          <div
            onClick={() => navigate("/appartements")}
            style={{ backgroundColor: "#FAF6F0", padding: "20px", borderRadius: "12px", border: "1px solid #E6DFD3", cursor: "pointer", textAlign: "center" }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0px 4px 15px rgba(163,144,129,0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
          >
            <div style={{ fontSize: "30px", marginBottom: "8px" }}>🏠</div>
            <div style={{ color: "#4E342E", fontWeight: "700", fontSize: "15px" }}>Appartements</div>
            <div style={{ color: "#9E8A78", fontSize: "13px", marginTop: "4px" }}>Ajouter / Modifier</div>
          </div>

          <div
            onClick={() => navigate("/AdminTechniciens")}
            style={{ backgroundColor: "#FAF6F0", padding: "20px", borderRadius: "12px", border: "1px solid #E6DFD3", cursor: "pointer", textAlign: "center" }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0px 4px 15px rgba(163,144,129,0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
          >
            <div style={{ fontSize: "30px", marginBottom: "8px" }}>🔧</div>
            <div style={{ color: "#4E342E", fontWeight: "700", fontSize: "15px" }}>Techniciens</div>
            <div style={{ color: "#9E8A78", fontSize: "13px", marginTop: "4px" }}>Pannes / Interventions</div>
          </div>

          <div
            onClick={() => navigate("/chat")}
            style={{ backgroundColor: "#FAF6F0", padding: "20px", borderRadius: "12px", border: "1px solid #E6DFD3", cursor: "pointer", textAlign: "center" }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0px 4px 15px rgba(163,144,129,0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
          >
            <div style={{ fontSize: "30px", marginBottom: "8px" }}>💬</div>
            <div style={{ color: "#4E342E", fontWeight: "700", fontSize: "15px" }}>Messagerie</div>
            <div style={{ color: "#9E8A78", fontSize: "13px", marginTop: "4px" }}>Contacter les clients</div>
          </div>

        </div>
      </div>
    </div>
  );
}
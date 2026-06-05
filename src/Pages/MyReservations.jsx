import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://homefit-backend-rjab.onrender.com";

export default function MyReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch les réservations du client connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    fetch(`${BASE_URL}/api/mes-reservations`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => { setReservations(data); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  //  Annuler une réservation
  const handleDelete = async (id) => {
    if (!window.confirm("Annuler cette réservation ?")) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/api/reservations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReservations(reservations.filter((r) => r.id !== id));
      } else {
        alert("Erreur lors de l'annulation");
      }
    } catch (err) {
      console.error(err);
    }
  };

  //  Badge statut avec les vrais noms du backend
  const getStatusBadge = (statut) => {
    switch (statut) {
      case "confirmee":
        return { backgroundColor: "#E8F5E9", color: "#2E7D32", label: "✅ Confirmée" };
      case "annulee":
        return { backgroundColor: "#FFEBEE", color: "#C62828", label: "❌ Annulée" };
      default:
        return { backgroundColor: "#FFF3E0", color: "#EF6C00", label: "⏳ En attente" };
    }
  };

  if (loading) return <div style={{ padding: "120px 40px", color: "#9E8A78", fontFamily: "'Segoe UI', sans-serif" }}>Chargement...</div>;

  return (
    <div style={{ padding: "120px 40px 40px 40px", maxWidth: "1000px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" }}>

      <div style={{ marginBottom: "35px" }}>
        <h1 style={{ fontSize: "32px", color: "#4E342E", fontWeight: "bold", margin: "0 0 10px 0" }}>
          Mes Réservations
        </h1>
        <p style={{ color: "#9E8A78", margin: 0 }}>Suivez l'état de vos demandes de séjour</p>
      </div>

      {reservations.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", backgroundColor: "#FAF6F0", borderRadius: "16px", border: "1px solid #E6DFD3", color: "#9E8A78" }}>
          <div style={{ fontSize: "40px", marginBottom: "15px" }}>📅</div>
          <p style={{ fontSize: "16px", margin: "0 0 20px 0", fontWeight: "500" }}>Aucune réservation pour le moment.</p>
          <button
            onClick={() => navigate("/appartements")}
            style={{ backgroundColor: "#4E342E", color: "#FDFBF7", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
          >
            Découvrir nos appartements
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {reservations.map((r) => {
            const badge = getStatusBadge(r.statut);
            // Calcul du nombre de nuits
            const nuits = Math.ceil(
              (new Date(r.date_fin) - new Date(r.date_debut)) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={r.id}
                style={{ backgroundColor: "#FAF6F0", borderRadius: "16px", border: "1px solid #E6DFD3", padding: "20px 25px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}
              >
                {/* Infos appartement */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: "17px", color: "#4E342E", fontWeight: "700" }}>
                    {/* app.titre depuis la relation */}
                    {r.appartement?.titre || "Appartement HomeFit"}
                  </h3>
                  <p style={{ margin: 0, color: "#9E8A78", fontSize: "14px" }}>
                    📍 {r.appartement?.ville}
                  </p>
                  <p style={{ margin: 0, color: "#5A4B41", fontSize: "14px" }}>
                    📅 {r.date_debut} → {r.date_fin}
                    <span style={{ color: "#9E8A78", marginLeft: "8px" }}>({nuits} nuit{nuits > 1 ? "s" : ""})</span>
                  </p>
                </div>

                {/* Prix + statut + bouton */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                  <span style={{ fontSize: "20px", color: "#4E342E", fontWeight: "bold" }}>
                    {/* prix_total depuis le backend */}
                    {r.prix_total} DH
                  </span>
                  <span style={{ backgroundColor: badge.backgroundColor, color: badge.color, padding: "5px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold" }}>
                    {badge.label}
                  </span>
                  {/* Annulation seulement si en attente */}
                  {r.statut === "en_attente" && (
                    <button
                      onClick={() => handleDelete(r.id)}
                      style={{ backgroundColor: "transparent", color: "#C62828", border: "1px solid #C62828", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
                    >
                      Annuler
                    </button>
                  )}
                  {r.statut === "confirmee" && (
                  <button
                    onClick={() => navigate("/Paiment", { 
                      state: { 
                        reservationId: r.id,
                        titre: r.appartement?.titre,
                        prix: r.appartement?.prix,
                        date_debut: r.date_debut,
                        date_fin: r.date_fin,
                        prix_total: r.prix_total
                      } 
                    })}
                    style={{  backgroundColor: "#4E342E",  color: "#FDFBF7", border: "none", padding: "6px 14px", 
                      borderRadius: "6px", 
                      cursor: "pointer", 
                      fontWeight: "600", 
                      fontSize: "13px",
                      marginTop: "8px"
                    }}
                  >
                   Payer
                  </button>
              )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
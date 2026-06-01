import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:8000";

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/reservations`, {
      headers: {Authorization: `Bearer ${localStorage.getItem("token")}`, Accept: "application/json",},
    }).then((res) => res.json())
      .then((data) => { setReservations(data); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  // Utilise les statuts du backend : confirmee / annulee / en_attente
  const updateStatus = async (id, newStatut) => {
    try {
      const res = await fetch(`${BASE_URL}/api/reservations/${id}/status`, {
        method: "PUT",
        headers: {"Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ statut: newStatut }), 
      });

      if (res.ok) {
        setReservations(
          reservations.map((r) => (r.id === id ? { ...r, statut: newStatut } : r))
        );
      } else {
        const data = await res.json();
        alert(data.message || "Erreur lors de la modification");
      }
    } catch (err) {
      console.error(err);
    }
  };

  //Badges avec les vrais statuts du backend
  const getStatusBadge = (statut) => {
    switch (statut) {
      case "confirmee":
        return { backgroundColor: "#E8F5E9", color: "#2E7D32", label: " Confirmée" };
      case "annulee":
        return { backgroundColor: "#FFEBEE", color: "#C62828", label: " Annulée" };
      default:
        return { backgroundColor: "#FFF3E0", color: "#EF6C00", label: " En attente" };
    }
  };

  if (loading) return <div style={{ padding: "120px 40px", color: "#9E8A78", fontFamily: "'Segoe UI', sans-serif" }}>Chargement...</div>;
  return (
    <div style={{ padding: "120px 40px 40px 40px", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <div style={{ marginBottom: "35px", width: "100%", textAlign: "left" }}>
        <h1 style={{ fontSize: "32px", color: "#4E342E", fontWeight: "bold", margin: "0 0 10px 0" }}>
          Gestion des Réservations
        </h1>
        <p style={{ color: "#9E8A78", margin: 0 }}>
          Validez ou refusez les demandes de réservation des clients HomeFit
        </p>
      </div>
      {reservations.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", backgroundColor: "#FAF6F0", borderRadius: "16px", border: "1px solid #E6DFD3", color: "#9E8A78", width: "100%", boxSizing: "border-box" }}>
          <div style={{ fontSize: "40px", marginBottom: "15px" }}>📅</div>
          <p style={{ fontSize: "16px", margin: 0, fontWeight: "500" }}>Aucune demande de réservation enregistrée.</p>
        </div>
      ) : (
        <div style={{ width: "100%", overflowX: "auto", backgroundColor: "#FAF6F0", borderRadius: "16px", border: "1px solid #E6DFD3" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14.5px" }}>
            <thead>
              <tr style={{ backgroundColor: "#A39081", color: "#4E342E" }}>
                <th style={{ padding: "16px 20px", fontWeight: "700" }}>Client</th>
                <th style={{ padding: "16px 20px", fontWeight: "700" }}>Appartement</th>
                <th style={{ padding: "16px 20px", fontWeight: "700" }}>Dates</th>
                <th style={{ padding: "16px 20px", fontWeight: "700" }}>Prix Total</th>
                <th style={{ padding: "16px 20px", fontWeight: "700" }}>Statut</th>
                <th style={{ padding: "16px 20px", fontWeight: "700", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r, index) => {const badge = getStatusBadge(r.statut); 
                return (
                  <tr key={r.id} style={{ borderBottom: "1px solid #E6DFD3", backgroundColor: index % 2 === 0 ? "#FDFBF7" : "#FAF6F0" }}>
                    <td style={{ padding: "16px 20px", color: "#4E342E", fontWeight: "600" }}>{r.user?.name || "Client anonyme"}</td>
                    <td style={{ padding: "16px 20px", color: "#5A4B41" }}>{r.appartement?.titre || "Logement HomeFit"}</td>
                    <td style={{ padding: "16px 20px", color: "#5A4B41", fontSize: "13px" }}>
                      {r.date_debut} → {r.date_fin}
                    </td>
                    <td style={{ padding: "16px 20px", color: "#4E342E", fontWeight: "bold" }}>{r.prix_total} DH</td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ backgroundColor: badge.backgroundColor, color: badge.color, padding: "5px 12px", borderRadius: "20px", fontSize: "12.5px", fontWeight: "bold", display: "inline-block" }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button onClick={() => updateStatus(r.id, "confirmee")} disabled={r.statut === "confirmee"}
                          style={{ backgroundColor: r.statut === "confirmee" ? "#E6DFD3" : "#2E7D32", color: "#FDFBF7", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: r.statut === "confirmee" ? "default" : "pointer", fontWeight: "600", fontSize: "13px" }}>
                          Accepter
                        </button>
                        <button onClick={() => updateStatus(r.id, "annulee")} disabled={r.statut === "annulee"}
                          style={{ backgroundColor: r.statut === "annulee" ? "#E6DFD3" : "#C62828", color: "#FDFBF7", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: r.statut === "annulee" ? "default" : "pointer", fontWeight: "600", fontSize: "13px" }}
                        >
                          Refuser
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
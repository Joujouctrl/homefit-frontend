import React, { useState, useEffect } from "react";

const BASE_URL = "https://homefit-backend-rjab.onrender.com";

export default function Technicien() {
  const [pannes, setPannes] = useState([]);        // pannes en attente
  const [interventions, setInterventions] = useState([]); // mes interventions acceptées
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  //  Charger les pannes en attente + mes interventions
  useEffect(() => { loadData();
    const interval = setInterval(loadData, 10000); // refresh toutes les 10s
    return () => clearInterval(interval);}, []
  );
  const loadData = async () => {
    try {
      // Pannes en attente
      const r1 = await fetch(`${BASE_URL}/api/pannes`, {
        headers: { Authorization: `Bearer ${token}` },});
      const d1 = await r1.json();
      setPannes(Array.isArray(d1) ? d1 : []);

      // Mes interventions
      const r2 = await fetch(`${BASE_URL}/api/mes-interventions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d2 = await r2.json();
      setInterventions(d2.success ? d2.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Accepter une panne
  const handleAccept = async (panneId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/pannes/${panneId}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        alert("Panne acceptée ✓");
        loadData();
      } else {
        alert(data.message || "Erreur");
      }
    } catch (err) {
      alert("Erreur réseau");
    }
  };

  // Refuser une panne
  const handleRefuse = async (panneId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/pannes/${panneId}/refuse`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        alert("Panne refusée");
        loadData();
      } else {
        alert(data.message || "Erreur");
      }
    } catch (err) {
      alert("Erreur réseau");
    }
  };

  // Marquer une intervention comme terminée
  const handleComplete = async (interventionId) => {
    try {const res = await fetch(`${BASE_URL}/api/interventions/${interventionId}/complete`, {
        method: "PUT",
        headers: {Authorization: `Bearer ${token}`,"Content-Type": "application/json",},
        body: JSON.stringify({ commentaire: "Intervention terminée" }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Intervention marquée comme terminée ✓");
        loadData();
      } else {
        alert(data.message || "Erreur");
      }
    } catch (err) {
      alert("Erreur réseau");
    }
  };

  const getPrioriteBadge = (priorite) => {
    switch (priorite) {
      case "urgente": return { bg: "#FFEBEE", color: "#C62828", label: "🚨 Urgente" };
      case "haute":   return { bg: "#FFF3E0", color: "#EF6C00", label: "🔴 Haute" };
      case "faible":  return { bg: "#E8F5E9", color: "#2E7D32", label: "🟢 Faible" };
      default:        return { bg: "#F3E5F5", color: "#6A1B9A", label: "🟡 Normale" };
    }
  };
  if (loading) return <div style={{ padding: "120px 40px", color: "#9E8A78", fontFamily: "'Segoe UI', sans-serif" }}>Chargement...</div>;
  // Interventions terminées (historique)
  const terminees = interventions.filter((i) => i.panne?.statut === "terminee");
  // Interventions en cours
  const enCours = interventions.filter((i) => i.panne?.statut === "en_cours");

  return (
    <div style={{ padding: "120px 20px 40px 20px", maxWidth: "900px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

      {/* Titre */}
      <div style={{ textAlign: "center", marginBottom: "35px", width: "100%" }}>
        <h1 style={{ fontSize: "32px", color: "#4E342E", fontWeight: "bold", margin: "0 0 10px 0" }}>
          Tableau de Bord Technicien
        </h1>
        <p style={{ color: "#9E8A78", margin: 0 }}>Suivi des interventions et des réclamations locataires</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "25px", width: "100%", textAlign: "left" }}>

        {/* Pannes en attente */}
        <div style={{ backgroundColor: "#FAF6F0", padding: "24px", borderRadius: "16px", border: "1px solid #E6DFD3" }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#4E342E", fontSize: "18px", fontWeight: "700", borderBottom: "2px solid #E6DFD3", paddingBottom: "10px" }}>
            🔔 Réclamations en attente ({pannes.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pannes.length === 0 ? (
              <p style={{ color: "#9E8A78", fontSize: "14.5px", margin: 0 }}>Aucune réclamation en attente.</p>
            ) : (
              pannes.map((p) => {
                const prio = getPrioriteBadge(p.priorite);
                return (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", backgroundColor: "#FDFBF7", borderRadius: "8px", borderLeft: "4px solid #A39081", gap: "15px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ color: "#4E342E", fontSize: "14px", fontWeight: "600" }}>{p.description}</span>
                      <span style={{ color: "#9E8A78", fontSize: "12px" }}>
                        👤 {p.client?.name} — 📍 {p.appartement?.titre}
                      </span>
                      <span style={{ backgroundColor: prio.bg, color: prio.color, padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", display: "inline-block", width: "fit-content" }}>
                        {prio.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => handleAccept(p.id)}style={{ backgroundColor: "#2E7D32", color: "white", border: "none", padding: "8px 16px", borderRadius: "12px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
                      > Accepter</button>
                      <button onClick={() => handleRefuse(p.id)}style={{ backgroundColor: "#C62828", color: "white", border: "none", padding: "8px 16px", borderRadius: "12px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
                      >Refuser </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/*  Mes missions en cours */}
        <div style={{ backgroundColor: "#FAF6F0", padding: "24px", borderRadius: "16px", border: "1px solid #E6DFD3" }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#4E342E", fontSize: "18px", fontWeight: "700", borderBottom: "2px solid #E6DFD3", paddingBottom: "10px" }}>
            🛠️ Missions en cours ({enCours.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {enCours.length === 0 ? (
              <p style={{ color: "#9E8A78", fontSize: "14.5px", margin: 0 }}>Aucune mission en cours.</p>
            ) : (
              enCours.map((i) => (
                <div key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", backgroundColor: "#FDFBF7", borderRadius: "8px", border: "1px solid #E6DFD3", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ color: "#4E342E", fontWeight: "600", fontSize: "14px" }}>{i.panne?.description}</span>
                    <span style={{ color: "#9E8A78", fontSize: "12px" }}>👤 {i.panne?.client?.name}</span>
                  </div>
                  <button  onClick={() => handleComplete(i.id)} style={{ backgroundColor: "#A39081", color: "#4E342E", border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}
                  >Marquer Terminé ✓</button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Historique */}
        <div style={{ backgroundColor: "#FAF6F0", padding: "24px", borderRadius: "16px", border: "1px solid #E6DFD3" }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#4E342E", fontSize: "18px", fontWeight: "700", borderBottom: "2px solid #E6DFD3", paddingBottom: "10px" }}>
            📜 Historique d'Interventions ({terminees.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {terminees.length === 0 ? (
              <p style={{ color: "#9E8A78", margin: 0 }}>Aucune intervention clôturée.</p>
            ) : (
              terminees.map((i, idx) => (
                <div key={idx} style={{ color: "#2E7D32", padding: "11px 16px", backgroundColor: "#E8F5E9", borderRadius: "8px", fontSize: "14.5px", fontWeight: "500" }}>
                  ✔ {i.panne?.description} — {i.panne?.client?.name} (Clôturée)
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
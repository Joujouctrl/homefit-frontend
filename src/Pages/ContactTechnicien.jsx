import React, { useState, useEffect } from "react";

const BASE_URL = "http://localhost:8000";

const ContactTechnicien = () => {
  const [description, setDescription] = useState("");
  const [priorite, setPriorite] = useState("normale");
  const [appartements, setAppartements] = useState([]);
  const [appartementId, setAppartementId] = useState("");
  const [loading, setLoading] = useState(false);
  const [mesPannes, setMesPannes] = useState([]);

  // Charger les appartements du client pour le select
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Charger les appartements disponibles
    fetch(`${BASE_URL}/api/appartements`)
      .then((r) => r.json())
      .then((data) => {
        setAppartements(data);
        if (data.length > 0) setAppartementId(data[0].id);
      });

    // Charger les pannes du client
    fetch(`${BASE_URL}/api/mes-pannes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setMesPannes(data.data);
      })
      .catch(() => {});
  }, []);

  const sendRequest = async () => {
    if (!description || !appartementId) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/pannes`, {
        method: "POST",
        headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`,},
        body: JSON.stringify({appartement_id: appartementId, description,priorite, }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Demande envoyée avec succées Un technicien va intervenir");
        setDescription("");
        setPriorite("normale");
        // Recharger les pannes
        const r2 = await fetch(`${BASE_URL}/api/mes-pannes`, { headers: { Authorization: `Bearer ${token}` },});
        const d2 = await r2.json();
        if (d2.success) setMesPannes(d2.data);
      } else {
        alert(data.message || "Erreur lors de l'envoi");
      }
    } catch (err) { console.error(err); 
      alert("Erreur réseau");} 
      finally {setLoading(false);}
  };

  // Badge statut
  const getStatutBadge = (statut) => {
    switch (statut) {
      case "en_cours":   return { bg: "#FFF3E0", color: "#EF6C00", label: "🔧 En cours" };
      case "terminee":   return { bg: "#E8F5E9", color: "#2E7D32", label: "✅ Terminée" };
      case "refusee":    return { bg: "#FFEBEE", color: "#C62828", label: "❌ Refusée" };
      default:           return { bg: "#E3F2FD", color: "#1565C0", label: "⏳ En attente" };
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

  return (
    <div style={{ padding: "120px 40px 40px 40px", maxWidth: "750px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Titre */}
      <div style={{ marginBottom: "35px" }}>
        <h1 style={{ fontSize: "32px", color: "#4E342E", fontWeight: "bold", margin: "0 0 10px 0" }}>
          Contacter un Technicien
        </h1>
        <p style={{ color: "#9E8A78", margin: 0 }}>Déclarez une panne, un technicien interviendra rapidement</p>
      </div>

      {/* Formulaire */}
      <div style={{ backgroundColor: "#FAF6F0", padding: "28px", borderRadius: "16px", border: "1px solid #E6DFD3", marginBottom: "30px" }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#4E342E", fontSize: "18px", fontWeight: "700" }}>📋 Nouvelle Réclamation</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Appartement */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ color: "#4E342E", fontWeight: "600", fontSize: "14px" }}>Appartement concerné</label>
            <select value={appartementId} onChange={(e) => setAppartementId(e.target.value)} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #A39081", backgroundColor: "#FDFBF7", color: "#4E342E", outline: "none", fontSize: "14px" }}>
              {appartements.map((a) => (
                <option key={a.id} value={a.id}>{a.titre} — {a.ville}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ color: "#4E342E", fontWeight: "600", fontSize: "14px" }}>Description du problème</label>
            <textarea placeholder="Ex: Fuite d'eau dans la salle de bain, panne électrique..." value={description}onChange={(e) => setDescription(e.target.value)}
              rows={4} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #A39081", backgroundColor: "#FDFBF7", color: "#4E342E", outline: "none", fontSize: "14px", resize: "vertical", fontFamily: "'Segoe UI', sans-serif" }}/>
          </div>

          {/* Priorité */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ color: "#4E342E", fontWeight: "600", fontSize: "14px" }}>Priorité</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["faible", "normale", "haute", "urgente"].map((p) => (
                <div key={p} onClick={() => setPriorite(p)} style={{ padding: "8px 18px",borderRadius: "20px",border: `2px solid ${priorite === p ? "#4E342E" : "#E6DFD3"}`,
                    backgroundColor: priorite === p ? "#4E342E" : "#FDFBF7",color: priorite === p ? "#FDFBF7" : "#4E342E", cursor: "pointer",
                    fontWeight: "600",fontSize: "13px",textTransform: "capitalize", transition: "all 0.2s"}}>
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* Bouton */}
          <button
            onClick={sendRequest}
            disabled={loading}
            style={{ backgroundColor: "#4E342E", color: "#FDFBF7", border: "none", padding: "14px", borderRadius: "8px", cursor: loading ? "default" : "pointer", fontWeight: "bold", fontSize: "15px", marginTop: "5px", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Envoi en cours..." : "📩 Envoyer la réclamation"}
          </button>
        </div>
      </div>

      {/* Mes pannes */}
      <div style={{ backgroundColor: "#FAF6F0", padding: "28px", borderRadius: "16px", border: "1px solid #E6DFD3" }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#4E342E", fontSize: "18px", fontWeight: "700" }}>📜 Mes Réclamations </h3>

        {mesPannes.length === 0 ? (
          <p style={{ color: "#9E8A78", margin: 0, fontSize: "14px" }}>Aucune réclamation envoyée pour le moment.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {mesPannes.map((p) => {const statut = getStatutBadge(p.statut); const prio = getPrioriteBadge(p.priorite);
              return (
                <div key={p.id} style={{ backgroundColor: "#FDFBF7", padding: "16px 20px", borderRadius: "10px", border: "1px solid #E6DFD3", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ margin: 0, color: "#4E342E", fontWeight: "600", fontSize: "15px" }}>{p.description}</p>
                  <p style={{ margin: 0, color: "#9E8A78", fontSize: "13px" }}>📍 {p.appartement?.titre} — {p.appartement?.ville}</p>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ backgroundColor: statut.bg, color: statut.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>{statut.label}</span>
                    <span style={{ backgroundColor: prio.bg, color: prio.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>{prio.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactTechnicien;
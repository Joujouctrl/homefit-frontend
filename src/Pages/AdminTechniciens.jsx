import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:8000";

export default function AdminTechniciens() {
  const [techniciens, setTechniciens] = useState([]);
  const [pannes, setPannes] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // ✅ Charger les techniciens
      const r1 = await fetch(`${BASE_URL}/api/users/techniciens`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d1 = await r1.json();
      setTechniciens(d1.success ? d1.data : []);

      // ✅ Charger toutes les pannes avec interventions
      const r2 = await fetch(`${BASE_URL}/api/admin/pannes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d2 = await r2.json();
      setPannes(Array.isArray(d2) ? d2 : []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Trouver les pannes d'un technicien
  const getPannesDuTechnicien = (technicienId) => {
    return pannes.filter(
      (p) => p.technicien_id === technicienId || p.intervention?.technicien_id === technicienId
    );
  };

  const getStatutBadge = (statut) => {
    switch (statut) {
      case "en_cours":  return { bg: "#FFF3E0", color: "#EF6C00", label: "🔧 En cours" };
      case "terminee":  return { bg: "#E8F5E9", color: "#2E7D32", label: "✅ Terminée" };
      case "refusee":   return { bg: "#FFEBEE", color: "#C62828", label: "❌ Refusée" };
      default:          return { bg: "#E3F2FD", color: "#1565C0", label: "⏳ En attente" };
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

  return (
    <div style={{ padding: "120px 40px 40px 40px", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Titre */}
      <div style={{ marginBottom: "35px" }}>
        <h1 style={{ fontSize: "32px", color: "#4E342E", fontWeight: "bold", margin: "0 0 10px 0" }}>
          Gestion des Techniciens
        </h1>
        <p style={{ color: "#9E8A78", margin: 0 }}>
          {techniciens.length} technicien{techniciens.length > 1 ? "s" : ""} enregistré{techniciens.length > 1 ? "s" : ""}
        </p>
      </div>

      {techniciens.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px", backgroundColor: "#FAF6F0", borderRadius: "16px", border: "1px solid #E6DFD3", color: "#9E8A78" }}>
          <div style={{ fontSize: "40px", marginBottom: "15px" }}>🔧</div>
          <p style={{ fontSize: "16px", margin: 0 }}>Aucun technicien enregistré.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {techniciens.map((tech) => {
            const pannesDuTech = getPannesDuTechnicien(tech.id);
            const enCours = pannesDuTech.filter(p => p.statut === "en_cours").length;
            const terminees = pannesDuTech.filter(p => p.statut === "terminee").length;

            return (
              <div key={tech.id} style={{ backgroundColor: "#FAF6F0", borderRadius: "16px", border: "1px solid #E6DFD3", overflow: "hidden" }}>

                {/* Header technicien */}
                <div style={{ backgroundColor: "#A39081", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "#4E342E", display: "flex", alignItems: "center", justifyContent: "center", color: "#FDFBF7", fontWeight: "bold", fontSize: "18px" }}>
                      {tech.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color: "#4E342E", fontWeight: "700", fontSize: "17px" }}>{tech.name}</div>
                      <div style={{ color: "#5A4B41", fontSize: "13px" }}>{tech.email}</div>
                    </div>
                  </div>

                  {/* Stats rapides */}
                  <div style={{ display: "flex", gap: "15px" }}>
                    <div style={{ backgroundColor: "#FFF3E0", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold", color: "#EF6C00" }}>
                       {enCours} en cours
                    </div>
                    <div style={{ backgroundColor: "#E8F5E9", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold", color: "#2E7D32" }}>
                       {terminees} terminées
                    </div>
                  </div>
                </div>

                {/* Pannes du technicien */}
                <div style={{ padding: "20px 24px" }}>
                  <h4 style={{ margin: "0 0 15px 0", color: "#4E342E", fontSize: "15px", fontWeight: "700" }}>
                    Pannes assignées ({pannesDuTech.length})
                  </h4>

                  {pannesDuTech.length === 0 ? (
                    <p style={{ color: "#9E8A78", fontSize: "14px", margin: 0 }}>Aucune panne assignée à ce technicien.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {pannesDuTech.map((p) => {
                        const statut = getStatutBadge(p.statut);
                        const prio = getPrioriteBadge(p.priorite);
                        return (
                          <div key={p.id} style={{ backgroundColor: "#FDFBF7", padding: "14px 18px", borderRadius: "10px", border: "1px solid #E6DFD3", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                              <span style={{ color: "#4E342E", fontWeight: "600", fontSize: "14px" }}>{p.description}</span>
                              <span style={{ color: "#9E8A78", fontSize: "12px" }}>
                                👤 {p.client?.name} — 📍 {p.appartement?.titre}
                              </span>
                            </div>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                              <span style={{ backgroundColor: prio.bg, color: prio.color, padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
                                {prio.label}
                              </span>
                              <span style={{ backgroundColor: statut.bg, color: statut.color, padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
                                {statut.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
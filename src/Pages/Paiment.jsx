import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Paiement() {
  const location = useLocation();
  const navigate = useNavigate();
  const resa = location.state; // ✅ données passées depuis MyReservations

  const [detailsReservation] = useState({
    nomPropriete: resa?.titre || "HomeFit",
    prixParJour: resa?.prix || 0,
    dateDebut: resa?.date_debut || "",
    dateFin: resa?.date_fin || "",
  });

  const [nombreJours, setNombreJours] = useState(0);
  const [totalMontant, setTotalMontant] = useState(0);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ Calcul depuis les données de la réservation
  useEffect(() => {
    if (resa?.prix_total) {
      setTotalMontant(resa.prix_total);
      const debut = new Date(resa.date_debut);
      const fin = new Date(resa.date_fin);
      setNombreJours(Math.ceil((fin - debut) / (1000 * 60 * 60 * 24)));
    }
  }, []);

  // ✅ Si pas de données (accès direct à la page), rediriger
  if (!resa) {
    return (
      <div style={{ padding: "140px 20px", textAlign: "center", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ backgroundColor: "#FAF6F0", maxWidth: "500px", margin: "0 auto", padding: "40px", borderRadius: "16px", border: "1px solid #E6DFD3" }}>
          <span style={{ fontSize: "50px" }}>⚠️</span>
          <h2 style={{ color: "#4E342E" }}>Aucune réservation sélectionnée</h2>
          <p style={{ color: "#9E8A78" }}>Veuillez sélectionner une réservation confirmée depuis vos réservations.</p>
          <button
            onClick={() => navigate("/MyReservations")}
            style={{ backgroundColor: "#4E342E", color: "#FDFBF7", border: "none", padding: "12px 25px", borderRadius: "25px", cursor: "pointer", marginTop: "20px", fontWeight: "600" }}
          >
            Mes Réservations
          </button>
        </div>
      </div>
    );
  }

  const handlePaiementSubmit = (e) => {
    e.preventDefault();
    if (cardNumber && expiry && cvv && name) {
      setIsSuccess(true);
    } else {
      alert("Veuillez remplir tous les champs de la carte bancaire.");
    }
  };

  if (isSuccess) {
    return (
      <div style={{ padding: "140px 20px", textAlign: "center", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ backgroundColor: "#FAF6F0", maxWidth: "500px", margin: "0 auto", padding: "40px", borderRadius: "16px", border: "1px solid #E6DFD3", boxShadow: "0px 8px 25px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: "60px" }}>✅</span>
          <h2 style={{ color: "#4E342E", marginTop: "20px" }}>Paiement Confirmé !</h2>
          <p style={{ color: "#9E8A78", fontSize: "15px", lineHeight: "1.6" }}>
            Votre paiement de <strong>{totalMontant} DHS</strong> a été effectué avec succès pour <strong>{detailsReservation.nomPropriete}</strong>.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{ backgroundColor: "#4E342E", color: "#FDFBF7", border: "none", padding: "12px 25px", borderRadius: "25px", cursor: "pointer", marginTop: "20px", fontWeight: "600" }}
          >
            Retour à l'Accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "120px 20px 60px 20px", maxWidth: "950px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" }}>

      <h1 style={{ textAlign: "center", color: "#4E342E", fontSize: "30px", fontWeight: "bold", marginBottom: "40px" }}>
        Finaliser votre Réservation
      </h1>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>

        {/* Résumé du séjour */}
        <div style={{ flex: 1, minWidth: "280px", backgroundColor: "#FAF6F0", padding: "25px", borderRadius: "16px", border: "1px solid #E6DFD3", height: "fit-content" }}>
          <h3 style={{ color: "#4E342E", borderBottom: "2px solid #E6DFD3", paddingBottom: "10px", margin: "0 0 20px 0" }}>
            🏠 Détails du séjour
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "#5A4B41", fontSize: "14.5px" }}>
            <div><strong>Hébergement:</strong> {detailsReservation.nomPropriete}</div>
            <div><strong>Du:</strong> {detailsReservation.dateDebut}</div>
            <div><strong>Au:</strong> {detailsReservation.dateFin}</div>
            <div><strong>Prix de base:</strong> {detailsReservation.prixParJour} DHS / Nuit</div>

            <hr style={{ border: "none", borderTop: "1px dashed #E6DFD3", margin: "15px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", color: "#4E342E" }}>
              <span>Durée du séjour:</span>
              <strong>{nombreJours} Nuits</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", color: "#4E342E", fontWeight: "bold", backgroundColor: "#FDFBF7", padding: "15px", borderRadius: "8px", border: "1px solid #A39081", marginTop: "10px" }}>
              <span>Total à payer:</span>
              <span style={{ color: "#A39081" }}>{totalMontant} DHS</span>
            </div>
          </div>
        </div>

        {/* Formulaire paiement */}
        <div style={{ flex: 1.2, minWidth: "280px", backgroundColor: "#FAF6F0", padding: "25px", borderRadius: "16px", border: "1px solid #E6DFD3" }}>
          <h3 style={{ color: "#4E342E", borderBottom: "2px solid #E6DFD3", paddingBottom: "10px", margin: "0 0 20px 0" }}>
            💳 Paiement par carte sécurisé
          </h3>

          <form onSubmit={handlePaiementSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ color: "#5A4B41", fontSize: "13.5px", fontWeight: "600" }}>Nom sur la carte</label>
              <input
                type="text"
                placeholder="M. Nom Prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ padding: "11px 15px", borderRadius: "8px", border: "1px solid #A39081", background: "#FDFBF7", outline: "none", color: "#4E342E" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ color: "#5A4B41", fontSize: "13.5px", fontWeight: "600" }}>Numéro de carte</label>
              <input
                type="text"
                maxLength="19"
                placeholder="4000 1234 5678 9010"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                style={{ padding: "11px 15px", borderRadius: "8px", border: "1px solid #A39081", background: "#FDFBF7", outline: "none", color: "#4E342E" }}
              />
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ color: "#5A4B41", fontSize: "13.5px", fontWeight: "600" }}>Date d'expiration</label>
                <input type="text" maxLength="5" placeholder="MM/AA"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  style={{ padding: "11px 15px", borderRadius: "8px", border: "1px solid #A39081", background: "#FDFBF7", outline: "none", color: "#4E342E", textAlign: "center" }}
                />
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ color: "#5A4B41", fontSize: "13.5px", fontWeight: "600" }}>Code CVV</label>
                <input type="password" maxLength="3" placeholder="123" value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  style={{ padding: "11px 15px", borderRadius: "8px", border: "1px solid #A39081", background: "#FDFBF7", outline: "none", color: "#4E342E", textAlign: "center" }}
                />
              </div>
            </div>

            <button type="submit" style={{ backgroundColor: "#4E342E", color: "#FDFBF7", border: "none", padding: "14px", borderRadius: "25px", cursor: "pointer", fontWeight: "700", fontSize: "15px", marginTop: "15px", boxShadow: "0px 4px 10px rgba(78, 52, 46, 0.2)" }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              Payer {totalMontant} DHS En Toute Sécurité
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
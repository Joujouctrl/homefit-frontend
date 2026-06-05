import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const BASE_URL = "https://homefit-backend-rjab.onrender.com";

export default function AppartementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" }
  ]);
  const [selectedImage, setSelectedImage] = useState(null);

  //  Fetch l'appartement depuis le backend
  useEffect(() => {
    fetch(`${BASE_URL}/api/appartements/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setApp(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur:", err);
        setLoading(false);
      });
  }, [id]);

  //  Construire l'URL complète de chaque image
  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (imgPath.startsWith("http")) return imgPath;
    return `${BASE_URL}/${imgPath}`;
  };

  // Réservation via le backend
  const handleReservation = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vous devez être connecté pour réserver.");
      navigate("/login");
      return;
    }

    const start = dateRange[0].startDate;
    const end = dateRange[0].endDate;

    const formatDate = (d) => d.toISOString().split("T")[0]; // YYYY-MM-DD

    try {
      const res = await fetch(`${BASE_URL}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          appartement_id: id,
          date_debut: formatDate(start),
          date_fin: formatDate(end),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Réservation demandée avec succès ! En attente de validation ✅");
        setShowForm(false);
      } else {
        alert(data.message || "Erreur lors de la réservation");
      }
    } catch (err) {
      console.error("Erreur réservation:", err);
      alert("Erreur réseau");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "120px 40px", fontFamily: "'Segoe UI', sans-serif", color: "#9E8A78" }}>
        Chargement...
      </div>
    );
  }

  if (!app) {
    return (
      <div style={{ padding: "120px 40px", fontFamily: "'Segoe UI', sans-serif" }}>
        <h2 style={{ color: "#C62828" }}>⚠️ Appartement non trouvé</h2>
      </div>
    );
  }

  //  Images depuis app.images (table appartement_images)
  const allImages = app.images && app.images.length > 0
    ? app.images.map((i) => i.image)
    : app.image ? [app.image] : [];

  return (
    <div
      style={{
        padding: "120px 40px 40px 40px",
        maxWidth: "1100px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "25px"
      }}
    >
      {/* Titre & Ville */}
      <div style={{ width: "100%", textAlign: "left" }}>
        <h1 style={{ fontSize: "32px", color: "#4E342E", fontWeight: "bold", margin: "0 0 8px 0" }}>
          {app.titre}
        </h1>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexWrap: "wrap", gap: "15px" }}>
          <p style={{ color: "#9E8A78", margin: 0, fontSize: "16px", fontWeight: "500" }}>
            📍 {app.ville}, Maroc
          </p>
          <span style={{ fontSize: "24px", color: "#4E342E", fontWeight: "bold", backgroundColor: "#FAF6F0", padding: "8px 20px", borderRadius: "30px", border: "1px solid #E6DFD3" }}>
            {app.prix} DH <span style={{ fontSize: "14px", color: "#9E8A78", fontWeight: "normal" }}>/ nuit</span>
          </span>
        </div>
      </div>

      {/* Grid d'images depuis le backend */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "15px",
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden"
        }}
      >
        {allImages.map((img, index) => (
          <div key={index}  onClick={() => setSelectedImage(getImageUrl(img))} style={{ height: "180px", backgroundColor: "#E6DFD3", overflow: "hidden" }}>
            <img
              src={getImageUrl(img)}
              alt={`${app.titre} - ${index}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
        ))}
      </div>

      {/* 3. Lightbox — ajoute ça juste après la grid */}
     {selectedImage && (
      <div onClick={() => setSelectedImage(null)} style={{position: "fixed",top: 0, left: 0,width: "100vw", height: "100vh",backgroundColor: "rgba(0,0,0,0.85)",display: "flex",justifyContent: "center",
      alignItems: "center",zIndex: 9999,cursor: "zoom-out"}}>
    {/* Bouton fermer */}
    <button
      onClick={() => setSelectedImage(null)}style={{position: "absolute",top: "20px", right: "30px",background: "none",
        border: "none",color: "#fff",fontSize: "36px",cursor: "pointer",fontWeight: "bold"}}>✕
    </button>

    {/* Image en grand */}
    <img
      src={selectedImage} alt="full" onClick={(e) => e.stopPropagation()} // empêche la fermeture en cliquant sur l'image
       style={{maxWidth: "90vw",  maxHeight: "90vh", objectFit: "contain", borderRadius: "12px", boxShadow: "0px 20px 60px rgba(0,0,0,0.5)"}}/>
  </div>
    )}

      {/* Description */}
      <div style={{ backgroundColor: "#FAF6F0", padding: "25px", borderRadius: "12px", border: "1px solid #E6DFD3", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
        <h3 style={{ margin: "0 0 10px 0", color: "#4E342E", fontSize: "18px", fontWeight: "700" }}>
          Description du logement
        </h3>
        {/*  app.description depuis le backend */}
        <p style={{ color: "#5A4B41", margin: 0, lineHeight: "1.6", fontSize: "15px" }}>
          {app.description}
        </p>
      </div>

      {/* Zone de réservation */}
      <div style={{ width: "100%", marginTop: "10px" }}>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            style={{ backgroundColor: "#A39081", color: "#4E342E", border: "none", padding: "14px 35px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", boxShadow: "0px 4px 15px rgba(163, 144, 129, 0.2)" }}
          >
            🗓️ Planifier ma Réservation
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "20px",
              backgroundColor: "#FAF6F0",
              padding: "25px",
              borderRadius: "16px",
              border: "1px solid #E6DFD3",
              maxWidth: "400px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
              <h4 style={{ margin: 0, color: "#4E342E", fontSize: "16px", fontWeight: "700" }}>
                Sélectionnez vos dates :
              </h4>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "#C62828", cursor: "pointer", fontWeight: "bold" }}>
                Fermer
              </button>
            </div>

            <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #E6DFD3", width: "100%" }}>
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                rangeColors={["#A39081"]}
                minDate={new Date()} //  empêche de choisir une date passée
              />
            </div>

            <button
              onClick={handleReservation}
              style={{ backgroundColor: "#4E342E", color: "#FDFBF7", border: "none", padding: "12px 24px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px", width: "100%" }}
            >
              Confirmer la Demande
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
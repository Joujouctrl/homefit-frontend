import React, { useState, useEffect } from "react";  // useEffect ajouté
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://homefit-backend-rjab.onrender.com"; //  URL du backend

const Appartements = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const isAdmin = role?.toLowerCase() === "admin";

  //  Plus de données hardcodées — liste vide, remplie par le backend
  const [appartements, setAppartements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newApp, setNewApp] = useState({ title: "", city: "", price: "", image: "", imageFile: null });

  //  Charger les appartements depuis le backend au démarrage
  useEffect(() => {
  fetch("https://homefit-backend-rjab.onrender.com/api/appartements")
    .then(function(res) { return res.json(); })
    .then(function(data) {
      console.log("data:", data);
      setAppartements(data);
      setLoading(false);
    })
    .catch(function(err) {
      console.error(err);
      setLoading(false);
    });
}, []);
// 1. Ajoute ce state après les autres states
const [villeFilter, setVilleFilter] = useState("toutes");

// 2. Extraire les villes uniques depuis les appartements
const villes = ["toutes", ...new Set(appartements.map(a => a.ville))];

// 3. Filtrer les appartements
const appartementsFiltres = villeFilter === "toutes" 
  ? appartements 
  : appartements.filter(a => a.ville === villeFilter);

  // Construire l'URL complète de l'image principale
  const getImageUrl = (app) => {
    if (app.images && app.images.length > 0) {
      const img = app.images[0].image;
      if (img.startsWith("http")) return img;
      return `${BASE_URL}/${img}`;
    }
    if (app.image) {
      if (app.image.startsWith("http")) return app.image;
      return `${BASE_URL}/${app.image}`;
    }
    return null;
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewApp({ ...newApp, image: url, imageFile: file });
    }
  };

  const handleAdd = async () => {
    if (!newApp.title || !newApp.city || !newApp.price) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("titre", newApp.title);
    formData.append("ville", newApp.city);
    formData.append("prix", newApp.price);
    if (newApp.imageFile) {
      formData.append("image", newApp.imageFile);
    }

    try {
      const res = await fetch(`${BASE_URL}/api/admin/appartements`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      setAppartements([...appartements, data.data]);
      setShowForm(false);
      setNewApp({ title: "", city: "", price: "", image: "", imageFile: null });

    } catch (err) {
      console.error("Erreur ajout:", err);
      alert("Erreur lors de l'ajout");
    }
  };

  // Suppression via le backend
  const deleteApp = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet appartement ?")) return;

    const token = localStorage.getItem("token");
    try {
      await fetch(`${BASE_URL}/api/admin/appartements/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      setAppartements(appartements.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression");
    }
  };

  const editApp = (id) => {
    const app = appartements.find((a) => a.id === id);
    const title = prompt("Titre:", app.titre);
    const city = prompt("Ville:", app.ville);
    const price = prompt("Prix:", app.prix);

    if (title && city && price) {
      setAppartements(
        appartements.map((a) =>
          a.id === id ? { ...a, titre: title, ville: city, prix: Number(price) } : a
        )
      );
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "120px 40px", fontFamily: "'Segoe UI', sans-serif", color: "#9E8A78" }}>
        Chargement des appartements...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "120px 40px 40px 40px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {/* En-tête */}
      <div style={{ marginBottom: "35px", width: "100%", textAlign: "left" }}>
        <h1 style={{ fontSize: "32px", color: "#4E342E", fontWeight: "bold", margin: "0 0 10px 0" }}>
          Nos Appartements
        </h1>
        <p style={{ color: "#9E8A78", margin: 0 }}>
          Découvrez notre sélection exclusive de logements HomeFit
        </p>
      </div>

      {/* Bouton Admin */}
      {isAdmin && (
        <div style={{ width: "100%", marginBottom: "30px" }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ backgroundColor: "#A39081", color: "#4E342E", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "14.5px", boxShadow: "0px 4px 12px rgba(163, 144, 129, 0.15)" }}
          >
            {showForm ? "✕ Fermer le formulaire" : "➕ Ajouter un appartement"}
          </button>

          {showForm && (
            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px", maxWidth: "450px", backgroundColor: "#FAF6F0", padding: "24px", borderRadius: "12px", border: "1px solid #E6DFD3", width: "100%", boxSizing: "border-box" }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#4E342E", fontSize: "18px" }}>Nouveau Logement</h3>
              <input placeholder="Titre de l'appartement" value={newApp.title} onChange={(e) => setNewApp({ ...newApp, title: e.target.value })} style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #A39081", outline: "none", backgroundColor: "#FDFBF7", color: "#4E342E" }} />
              <input placeholder="Ville (ex: Casablanca)" value={newApp.city} onChange={(e) => setNewApp({ ...newApp, city: e.target.value })} style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #A39081", outline: "none", backgroundColor: "#FDFBF7", color: "#4E342E" }} />
              <input type="number" placeholder="Prix (DH)" value={newApp.price} onChange={(e) => setNewApp({ ...newApp, price: e.target.value })} style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #A39081", outline: "none", backgroundColor: "#FDFBF7", color: "#4E342E" }} />
              <input type="file" accept="image/*" onChange={handleImage} style={{ fontSize: "13.5px", color: "#5A4B41" }} />
              {newApp.image && <img src={newApp.image} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", marginTop: "5px", border: "1px solid #E6DFD3" }} />}
              <button onClick={handleAdd} style={{ backgroundColor: "#4E342E", color: "#FDFBF7", border: "none", padding: "12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", marginTop: "10px" }}>Confirmer l'ajout</button>
            </div>
          )}
        </div>
      )}
      {/*  Filtre par ville */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "25px" }}>
        {villes.map((ville) => (
          <button
            key={ville}
            onClick={() => setVilleFilter(ville)}
            style={{padding: "8px 18px", borderRadius: "20px", border: `2px solid ${villeFilter === ville ? "#4E342E" : "#E6DFD3"}`,backgroundColor: villeFilter === ville ? "#4E342E" : "#FDFBF7",
              color: villeFilter === ville ? "#FDFBF7" : "#4E342E",cursor: "pointer",fontWeight: "600",fontSize: "13px",textTransform: "capitalize" }}>
            {ville === "toutes" ? " Toutes les villes" : ` ${ville}`}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "30px", width: "100%" }}>
        {appartementsFiltres.map((app) => (
          <div
            className="card"
            key={app.id}
            onClick={() => navigate(`/appartement/${app.id}`)}
            style={{ cursor: "pointer", backgroundColor: "#FAF6F0", borderRadius: "16px", border: "1px solid #E6DFD3", overflow: "hidden", boxShadow: "0px 4px 15px rgba(163, 144, 129, 0.05)", display: "flex", flexDirection: "column" }}
          >
            {/*  Image depuis le backend */}
            <div style={{ height: "200px", width: "100%", overflow: "hidden", backgroundColor: "#E6DFD3" }}>
              <img
                src={getImageUrl(app)}
                alt={app.titre}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>

            {/*  Utilise app.titre / app.ville / app.prix (noms du backend) */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px", flex: 1, textAlign: "left" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#4E342E", fontWeight: "700" }}>{app.titre}</h3>
              <p style={{ margin: 0, color: "#9E8A78", fontSize: "14px", fontWeight: "500" }}>📍 {app.ville}</p>
              <span style={{ fontSize: "16px", color: "#A39081", fontWeight: "bold", marginTop: "5px", display: "block" }}>{app.prix} DH</span>

              {isAdmin && (
                <div style={{ marginTop: "auto", paddingTop: "15px", display: "flex", gap: "10px", borderTop: "1px solid #E6DFD3" }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); editApp(app.id); }}
                    style={{ flex: 1, backgroundColor: "#A39081", color: "#4E342E", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteApp(app.id); }}
                    style={{ flex: 1, backgroundColor: "#C62828", color: "#FDFBF7", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appartements;

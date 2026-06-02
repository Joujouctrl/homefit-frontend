import React, { useState, useEffect } from 'react'; 
import { useNavigate } from "react-router-dom";
import './fit.css';
import Chatbot from "../Components/Chatbot"; // Import s7i7 matchy m3a l'explorer

const Home = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [appartements, setAppartements] = useState([]);
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);

    // Fetch les 3 premiers appartements
    fetch("http://localhost:8000/api/appartements")
      .then(r => r.json())
      .then(data => setAppartements(data.slice(0, 3)))
      .catch(err => console.error(err));
  }, []);
  return (
    <div className="home-container">

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-overlay">
       <div className="hero-btns">
  {userName ? (
    // Connecté — affiche le message de bienvenue
    <h3 style={{color: "#FDFBF7",fontSize: "22px",fontWeight: "600",backgroundColor: "rgba(78, 52, 46, 0.4)",padding: "12px 28px",borderRadius: "30px",border: "1px solid rgba(253, 251, 247, 0.3)"}}>
      Bienvenue {role === "technicien" ? `Tech. ${userName}` : userName} !
    </h3>
  ) : (
    //Non connecté — affiche les boutons
    <>
      <button 
        className="btn outline"
        onClick={() => navigate("/login")}
      >
        LOG IN
      </button>
      <button 
        className="btn filled"
        onClick={() => navigate("/signup")}
      >
        SIGN UP
      </button>
    </>
  )}
</div>

        </div>
      </header>

      {/* Slogan Section */}
      <section className="slogan-wrapper">
        <h2 className="slogan-cursive">
          Where elegance meets smart living
        </h2>
      </section>

      {/* Appartements */}
    {localStorage.getItem("role") !== "admin" &&(
      <section className="app-section">
        <div className="grid">
          {appartements.map((app) => (
            <div 
              className="card" 
              key={app.id}
              onClick={() => navigate(`/appartement/${app.id}`)}
            >
              <img src={app.images?.[0]?.image ? `http://localhost:8000/${app.images[0].image}` : "/placeholder.jpg"} alt={app.titre} />

              <div className="card-info">
                <h3>{app.titre}</h3>
                <p>{app.ville}</p>
                <span>{app.prix} DH</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}
      {/* 💬 Le ChatBot m9add style w position */}
      <Chatbot />
      
    </div>
  );
};

export default Home;
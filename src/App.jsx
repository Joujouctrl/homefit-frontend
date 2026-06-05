import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Navbar from "./Pages/Navbar";
import Technicien from "./Pages/Technicien";
import "./Pages/fit.css";
import SignupPage from "./Pages/SignupPage";
import AppartementDetails from "./Pages/AppartementDetails";
import Appartements from "./Pages/Appartements";
import Chat from "./Pages/Chat";
import ContactTechnicien from "./Pages/ContactTechnicien";
import MyReservations from "./Pages/MyReservations";
import AdminReservations from "./Pages/AdminReservations";
import Paiment from "./Pages/Paiment";
import Dashboard from "./Pages/Dashboard";
import AdminTechniciens from "./Pages/AdminTechniciens";
const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" />;
  return element;
};

function App() {
  return (
    /* 🌟 ÉTAPE 1 : Configurer le conteneur principal en Flexbox vertical sur toute la hauteur de l'écran */
    <div 
      className="content" 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh" 
      }}
    >
      <BrowserRouter>
        
        <Navbar />

        {/* 🌟 ÉTAPE 2 : Envelopper les Routes dans une div qui prend 100% de l'espace dynamique restant (flex: 1) */}
        {/* C'est cette div qui va pousser le footer vers le bas si la page est vide ! */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/appartement/:id" element={<AppartementDetails />} />
            <Route path="/appartements" element={<Appartements />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/Technicien" element={<Technicien />} />
            <Route path="/ContactTechnicien" element={<ContactTechnicien />} />
            <Route path="/MyReservations" element={<MyReservations />} />
            <Route path="/AdminReservations" element={<AdminReservations />} />
            <Route path="/AdminTechniciens" element={<AdminTechniciens />} />
            <Route path="/Paiment" element={<Paiment />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>

        {/* 🌟 ÉTAPE 3 : Le Footer est maintenant sagement inclus dans le cycle et restera collé en bas */}
        <footer className="home-footer">
          © 2026 HomeFit
        </footer>

      </BrowserRouter>
    </div>
  );
}

export default App;
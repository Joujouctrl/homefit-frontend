import React, { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!message) return;

    // 1. Afficher l-message dyal l'user fl-wajiha direct
    const userMsg = {
      sender: "user",
      text: message
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await axios.post("https://homefit-backend-rjab.onrender.com/api/chatbot", {
        message: message 
      });

      const botReply = response.data.response;

      const botMsg = {
        sender: "bot",
        text: botReply
      };

      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      console.error("Erreur lors de l'appel backend:", error);
      
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Désolé, le service est indisponible pour le moment." }
      ]);
    }

    setMessage("");
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      {/* button */}
      <button
        onClick={() => setOpen(!open)}
        style={{position: "fixed", bottom: "25px",right: "25px", width: "60px", height: "60px",borderRadius: "50%", border: "2px solid #FDFBF7", background: "#A39081", color: "#4E342E", fontSize: "26px",
          cursor: "pointer", zIndex: 9999,boxShadow: "0px 4px 15px rgba(78, 52, 46, 0.25)",display: "flex", justifyContent: "center", alignItems: "center", transition: "transform 0.2s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* chatbot */}
      {open && (
        <div
          style={{position: "fixed", bottom: "100px",  right: "25px",width: "350px", height: "500px", background: "#FAF6F0", borderRadius: "16px", border: "1px solid #E6DFD3",
            display: "flex",flexDirection: "column",
            zIndex: 9999,
            boxShadow: "0px 8px 30px rgba(78, 52, 46, 0.15)",
            overflow: "hidden"
          }}
        >
          {/* Header de la boite */}
          <div
            style={{
              background: "#4E342E", 
              padding: "15px 20px",
              color: "#FDFBF7",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#81C784" }}></div>
            <div>
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600" }}>Assistant IA HomeFit</h3>
              <span style={{ fontSize: "11px", color: "#E6DFD3" }}>En ligne</span>
            </div>
          </div>

          {/* messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "15px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "#FDFBF7" 
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left"
                }}
              >
                <span
                  style={{
                    background: msg.sender === "user" ? "#A39081" : "#4E342E", 
                    color: msg.sender === "user" ? "#4E342E" : "#FDFBF7",
                    padding: "10px 14px",
                    borderRadius: msg.sender === "user" ? "14px 14px 0px 14px" : "14px 14px 14px 0px",
                    display: "inline-block",
                    maxWidth: "80%",
                    fontSize: "14px",
                    lineHeight: "1.4",
                    textAlign: "left",
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.05)"
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* input section */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              padding: "12px 15px",
              background: "#FAF6F0",
              borderTop: "1px solid #E6DFD3",
              alignItems: "center"
            }}
          >
            <input
              type="text"
              placeholder="Décrire la panne..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              style={{
                flex: 1,
                padding: "10px 15px",
                borderRadius: "20px",
                border: "1px solid #A39081",
                outline: "none",
                fontSize: "14px",
                background: "#FDFBF7",
                color: "#4E342E"
              }}
            />

            <button
              onClick={handleSend}
              style={{
                background: "#4E342E",
                color: "#FDFBF7",
                border: "none",
                padding: "9px 15px",
                borderRadius: "18px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
                transition: "opacity 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect, useRef } from "react";

const BASE_URL = "https://homefit-backend-rjab.onrender.com";

export default function Chat() {
  const [conversations, setConversations] = useState([]); // liste des interlocuteurs
  const [selectedUser, setSelectedUser] = useState(null); // interlocuteur sélectionné
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [techniciens, setTechniciens] = useState([]); // pour le client : liste des techniciens

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Charger les conversations existantes
  useEffect(() => {
    loadConversations();
    // Si client, charger la liste des techniciens disponibles
    if (role === "client") loadTechniciens();
  }, []);

  // recharger les messages toutes les 5 secondes
  useEffect(() => {
    if (!selectedUser) return;
    loadMessages(selectedUser.id);
    const interval = setInterval(() => loadMessages(selectedUser.id), 5000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  const loadConversations = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setConversations(data.data);
    } catch (err) {
      console.error(err);
    }
  };
  const loadTechniciens = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/techniciens`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setTechniciens(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/messages`, {
        method: "POST",
        headers: {"Content-Type": "application/json",Authorization: `Bearer ${token}`,},
        body: JSON.stringify({receiver_id: selectedUser.id, content: text,}),
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...messages, data.data]);
        setText("");
        loadConversations(); // refresh la liste
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const selectUser = (user) => {
    setSelectedUser(user);
    loadMessages(user.id);
  };

  // Interlocuteurs disponibles = conversations existantes + techniciens (pour client)
  const allContacts = [
    ...conversations,
    ...techniciens.filter((t) => !conversations.find((c) => c.id === t.id)),
  ];

  return (
    <div style={{ padding: "120px 20px 40px 20px", maxWidth: "900px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Titre */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "32px", color: "#4E342E", fontWeight: "bold", margin: "0 0 10px 0" }}>
          Centre de Messagerie
        </h1>
        <p style={{ color: "#9E8A78", margin: 0 }}>
          Échangez directement avec notre équipe technique en temps réel
        </p>
      </div>

      <div style={{ display: "flex", gap: "20px", height: "550px" }}>

        {/* liste des contacts */}
        <div style={{ width: "250px", backgroundColor: "#FAF6F0", borderRadius: "16px", border: "1px solid #E6DFD3", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ backgroundColor: "#A39081", padding: "16px 20px" }}>
            <span style={{ color: "#4E342E", fontWeight: "700", fontSize: "15px" }}>
              {role === "client" ? "🔧 Techniciens" : "💬 Conversations"}
            </span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
            {allContacts.length === 0 ? (
              <p style={{ color: "#9E8A78", fontSize: "13px", padding: "10px", textAlign: "center" }}>
                Aucun contact disponible
              </p>
            ) : (
              allContacts.map((user) => (
                <div
                  key={user.id}
                  onClick={() => selectUser(user)}
                  style={{padding: "12px 14px",borderRadius: "10px", cursor: "pointer", backgroundColor: selectedUser?.id === user.id ? "#4E342E" : "transparent", color: selectedUser?.id === user.id ? "#FDFBF7" : "#4E342E",
                    marginBottom: "4px",transition: "all 0.2s", display: "flex",alignItems: "center", gap: "10px"
                  }}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: selectedUser?.id === user.id ? "#A39081" : "#E6DFD3", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px", color: "#4E342E", flexShrink: 0 }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>{user.name}</div>
                    <div style={{ fontSize: "11px", opacity: 0.7, textTransform: "capitalize" }}>{user.role}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/*  Colonne droite — conversation */}
        <div style={{ flex: 1, backgroundColor: "#FAF6F0", borderRadius: "16px", border: "1px solid #E6DFD3", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ backgroundColor: "#A39081", color: "#4E342E", padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "10px", height: "10px", backgroundColor: "#4E342E", borderRadius: "50%" }}></div>
            <div>
              <span style={{ fontWeight: "700", fontSize: "15px" }}>
                {selectedUser ? selectedUser.name : "Sélectionnez un contact"}
              </span>
              {selectedUser && (
                <span style={{ fontSize: "12px", display: "block", textTransform: "capitalize" }}>
                  {selectedUser.role}
                </span>
              )}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: "20px", overflowY: "auto", backgroundColor: "#FDFBF7", display: "flex", flexDirection: "column", gap: "12px" }}>
            {!selectedUser ? (
              <div style={{ textAlign: "center", color: "#9E8A78", marginTop: "80px" }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>💬</div>
                <p style={{ fontSize: "15px", margin: 0 }}>Sélectionnez un contact pour commencer</p>
              </div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: "center", color: "#9E8A78", marginTop: "80px" }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>✉️</div>
                <p style={{ fontSize: "15px", margin: 0 }}>Aucun message. Commencez la conversation !</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.sender_id === parseInt(localStorage.getItem("userId")) ||
                             msg.sender?.name === localStorage.getItem("userName");
                return (
                  <div key={i} style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "65%", display: "flex", flexDirection: "column" }}>
                    <div style={{backgroundColor: isMe ? "#A39081" : "#F4EFE6", color: "#4E342E", padding: "12px 18px", borderRadius: isMe ? "18px 18px 0px 18px" : "18px 18px 18px 0px", border: isMe ? "none" : "1px solid #E6DFD3", fontSize: "14.5px",fontWeight: isMe ? "500" : "normal"}}>
                      {msg.content}
                    </div>
                    <span style={{ fontSize: "11px", color: "#9E8A78", alignSelf: isMe ? "flex-end" : "flex-start", marginTop: "4px" }}>
                      {msg.sender?.name} — {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <div style={{ padding: "16px 20px", borderTop: "1px solid #E6DFD3", display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#FAF6F0" }}>
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder={selectedUser ? "Écrivez votre message..." : "Sélectionnez un contact d'abord"} disabled={!selectedUser} style={{ flex: 1, border: "1px solid #A39081", padding: "12px 18px", borderRadius: "30px", fontSize: "14px", outline: "none", backgroundColor: "#FDFBF7", color: "#4E342E" }}/>
            <button onClick={sendMessage} disabled={!selectedUser || loading} style={{ backgroundColor: selectedUser ? "#A39081" : "#E6DFD3", color: "#4E342E", border: "none", padding: "12px 24px", borderRadius: "30px", cursor: selectedUser ? "pointer" : "default", fontWeight: "bold", fontSize: "14px" }}
            >Envoyer</button>
          </div>
        </div>
      </div>
    </div>
  );
}
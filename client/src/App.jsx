import Chat from "./Chat.jsx";

export default function App() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{
        width: "250px",
        background: "#020617",
        color: "white",
        padding: "20px",
        borderRight: "1px solid #1e293b"
      }}>
        <h3>💬 Chats</h3>
        <div style={{ marginTop: 20, opacity: 0.7 }}>
          Nuevo chat
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1 }}>
        <Chat />
      </div>
    </div>
  );
}
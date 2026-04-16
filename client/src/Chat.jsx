import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  const send = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages: newMessages })
    });

    const data = await res.json();

    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
  };

  // Auto scroll hacia abajo
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Enter para enviar
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{
      maxWidth: 700,
      margin: "auto",
      height: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>

      {/* Chat */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: 20
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            background: m.role === "user" ? "#2563eb" : "#1e293b",
            margin: "10px 0",
            padding: "12px",
            borderRadius: "12px",
            color: "white",
            whiteSpace: "pre-wrap",     // 👈 mantiene saltos de línea
            wordBreak: "break-word"     // 👈 evita desbordes
          }}>
            {m.content}
          </div>
        ))}
        <div ref={chatRef} />
      </div>

      {/* Input tipo ChatGPT */}
      <div style={{
        display: "flex",
        padding: 10,
        borderTop: "1px solid #333",
        background: "#0f172a"
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Escribe tu mensaje..."
          style={{
            flex: 1,
            resize: "none",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            fontSize: "14px",
            maxHeight: "150px",
            overflowY: "auto"
          }}
        />
        <button
          onClick={send}
          style={{
            marginLeft: 10,
            padding: "10px 15px",
            borderRadius: "10px",
            background: "#2563eb",
            color: "white",
            border: "none"
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
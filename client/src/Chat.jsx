import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const send = async () => {
    if (!input) return;

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

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      {messages.map((m, i) => (
        <div key={i} style={{
          background: m.role === "user" ? "#2563eb" : "#1e293b",
          margin: "10px 0",
          padding: "10px",
          borderRadius: "10px",
          color: "white"
        }}>
          {m.content}
        </div>
      ))}

      <div style={{ display: "flex", marginTop: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={send}>Enviar</button>
      </div>
    </div>
  );
}
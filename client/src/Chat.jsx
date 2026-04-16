import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

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

  // Scroll automático
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto resize textarea
  const handleInput = (e) => {
    setInput(e.target.value);
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  // Enter para enviar
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#d4d9e4",
      color: "white"
    }}>

      {/* Chat */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        maxWidth: "800px",
        margin: "auto",
        width: "100%"
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start"
          }}>
            <div style={{
              background: m.role === "user" ? "#2563eb" : "#1e293b",
              padding: "12px 16px",
              borderRadius: "12px",
              margin: "6px 0",
              maxWidth: "80%",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: "14px",
              lineHeight: "1.5"
            }}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{
        borderTop: "1px solid #333",
        padding: "15px",
        display: "flex",
        justifyContent: "center"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          background: "#1e293b",
          borderRadius: "12px",
          padding: "10px"
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje..."
            rows={1}
            style={{
              flex: 1,
              resize: "none",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "14px",
              maxHeight: "200px",
              overflowY: "auto"
            }}
          />

          <button
            onClick={send}
            style={{
              marginLeft: "10px",
              background: "#2563eb",
              border: "none",
              color: "white",
              padding: "10px 16px",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
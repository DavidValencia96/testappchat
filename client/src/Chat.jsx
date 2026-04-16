import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const send = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error al responder" }
      ]);
    }

    setLoading(false);
  };

  // scroll automático
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // auto resize
  const handleInput = (e) => {
    setInput(e.target.value);
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  };

  // enter para enviar
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
      background: "#0b0f19",
      color: "white"
    }}>

      {/* Mensajes */}
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
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            animation: "fadeIn 0.3s ease"
          }}>
            <div style={{
              background: m.role === "user" ? "#2563eb" : "#111827",
              padding: "14px 18px",
              borderRadius: "16px",
              margin: "8px 0",
              maxWidth: "80%",
              boxShadow: "0 2px 10px rgba(0,0,0,0.4)"
            }}>
              <ReactMarkdown
                components={{
                  code({ inline, className, children }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code style={{
                        background: "#1f2937",
                        padding: "2px 6px",
                        borderRadius: "6px"
                      }}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {/* typing indicator */}
        {loading && (
          <div style={{ opacity: 0.6 }}>
            🤖 escribiendo...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{
        borderTop: "1px solid #1e293b",
        padding: "15px",
        display: "flex",
        justifyContent: "center"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          background: "#111827",
          borderRadius: "14px",
          padding: "10px",
          border: "1px solid #1f2937"
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
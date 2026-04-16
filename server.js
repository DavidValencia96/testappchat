import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// API CHAT
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const lastMessages = messages.slice(-3);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat", // 🔥 buen modelo gratis
        messages: lastMessages,
        max_tokens: 800
      })
    });

    const data = await response.json();

    console.log("OPENROUTER:", JSON.stringify(data, null, 2));

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sin respuesta";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en servidor" });
  }
});

// SERVIR FRONTEND
const __dirname = new URL('.', import.meta.url).pathname;
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
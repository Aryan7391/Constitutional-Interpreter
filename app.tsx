import { useState, useEffect } from "react";
import "./App.css";

type Message = {
  role: "user" | "assistant";
  text: string;
};

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [
      ...prev,
      { role: "user", text: input },
      { role: "assistant", text: "Assistant reply placeholder..." }
    ]);

    setInput("");
  };

  return (
    <div className="app">

      <div className="top-bar">
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          Toggle Theme
        </button>
      </div>

      <div className="header-bar">
        <strong>Chat UI</strong>
      </div>

      <div className="chat-container">
        {messages.map((msg, i) => (
          <div key={i} className={`message-row ${msg.role}`}>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="input-wrapper">
        <div className="input-container">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

    </div>
  );
}

export default App;
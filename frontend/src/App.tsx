import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send query
  const sendQuery = async () => {
    if (!query.trim()) return;

    const userMessage: Message = { role: "user", content: query };

    setMessages(prev => [...prev, userMessage]);
    setQuery("");

    try {
      // 🔹 Call your backend here
      const res = await fetch("http://localhost:3000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "assistant",
        content: data.analysis || "No response received"
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Error connecting to backend."
        }
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendQuery();
  };

  return (
    <div className="app-container">

      {/* ================= Sidebar ================= */}
      <aside className="sidebar">
        <div className="logo">⚖ Constitutional AI</div>

        

        

        <div className="sidebar-footer">
          Indian Constitutional & Penal Law Assistant
        </div>
      </aside>

      {/* ================= Main Chat ================= */}
      <main className="chat-area">

        <div className="chat-wrapper">

          {/* Messages */}
          <div className="messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${msg.role}`}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="input-area">
            <input
              type="text"
              placeholder="Ask about Indian Constitution or IPC..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={sendQuery}>Send</button>
          </div>

        </div>

      </main>

    </div>
  );
}
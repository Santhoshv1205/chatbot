import { useState } from 'react';
import './App.css';
import Lottie from "lottie-react";
import AIAnimation from './assets/Animation_AI.json';
import axios from 'axios';

function App() {
  const ai_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC1mxvWoQbY9gsif5hEXu5kXdb1FcjeDro";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState([]);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await axios.post(ai_url, {
        contents: [{ parts: [{ text: input }] }]
      });

      const botReply = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand.";
      const aiMessage = { sender: "bot", text: botReply };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      setHistory(prev => [...prev, { title: input, messages: finalMessages }]);
    } catch (error) {
      const errorMessage = { sender: "bot", text: "Error connecting to AI." };
      setMessages([...updatedMessages, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const loadChat = (chat) => setMessages(chat.messages);

  return (
    <div className="app-wrapper">
      {sidebarOpen && (
        <div className="sidebar">
          <h2>Virtual Assistant</h2>
          <button className="new-chat-btn" onClick={() => setMessages([])}>+ New Chat</button>
          <div className="chat-history">
            <h4>History</h4>
            {history.map((chat, index) => (
              <p key={index} onClick={() => loadChat(chat)}>{chat.title}</p>
            ))}
          </div>
        </div>
      )}

      <div className="main-chat">
        <div className="chat-header">
          <button onClick={toggleSidebar} className="toggle-sidebar-btn">
            {sidebarOpen ? "←" : "→"}
          </button>
          <Lottie animationData={AIAnimation} style={{ width: "4rem" }} />
        </div>

        <div className="chat-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="chat-footer">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={handleSubmit}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;

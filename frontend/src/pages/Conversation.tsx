import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LuChevronLeft, LuArrowUp } from "react-icons/lu";
import "./Conversation.css";
import ImageWithFallback from "../components/ImageWithFallback";
import { Profile } from "@shared/Profile";
import { useState } from "react";

const Conversation = () => {
  const location = useLocation();
  const user = Profile.fromObject(location.state?.user) as Profile;
  const navigate = useNavigate();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Push user input immediately
    setMessages((prev) => [...prev, `You: ${input}`]);

    // Simulate bot reply with delay (after a short timeout)
    setInput("");

    setTimeout(() => {
      // Add bot's reply after a delay
      setMessages((prev) => [...prev, `Bot: Bow Wow!🦴`]);
    }, 1000); // Delay of 1.0 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="conversation-page">
      <div className="conversation-header">
        <LuChevronLeft className="back-icon" onClick={handleBackClick} />
        <div className="conversation-info">
          <ImageWithFallback
            src={user.imageLink}
            alt={`${user.dogName}'s profile`}
            className="conversation-image"
          />
          <h2 className="match-title">
            {user.ownerName} & {user.dogName}
          </h2>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${
              msg.startsWith("You:") ? "sent" : "received"
            }`}
          >
            {msg.replace("You: ", "").replace("Bot: ", "")}
          </div>
        ))}
      </div>

      <div className="message-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>
          <LuArrowUp className="send-arrow" />
        </button>
      </div>
    </div>
  );
};

export default Conversation;

//about half of the code on this page was added by John.
// (mostly the bottom half)
// Don't be afraid to change something if you need to

import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LuChevronLeft, LuArrowUp } from "react-icons/lu";
import "./Conversation.css";
import ImageWithFallback from "../components/ImageWithFallback";
import { Profile } from "@shared/Profile";
import { useState } from "react";
import { useEffect } from "react";
import { MessageService } from "../services/MessageService";
import { UserService } from "../services/UserService";
import { Conversation } from "@shared/Conversation";

const ConversationPage = () => {
  const [newMessage, setNewMessage] = useState("");
  const [myEmail, setMyEmail] = useState("");
  const [userService] = useState<UserService>(new UserService());
  const location = useLocation();
  const user = Profile.fromObject(location.state?.user) as Profile;
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  // const [input, setInput] = useState("");

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    userService.getProfile().then((profile) => {
      if (profile) {
        setMyEmail(profile.email);
      }
    });
    const fetchConversation = async () => {
      const conversation = await MessageService.instance.getConversation(
        user.email
      );
      if (conversation) setConversation(conversation);
      console.log(conversation?.messages, conversation?.id);
    };
    fetchConversation();
  }, []);

  const handleSend = async () => {
    if (newMessage.trim() !== "") {
      console.log("Sending message: ", newMessage);
      const conversation = await MessageService.instance.sendMessage(
        myEmail,
        user.email,
        newMessage
      );
      if (conversation) {
        setConversation(conversation);
      } else {
        console.error("Failed to send message.");
      }
      setNewMessage("");
    }
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
          <h2 className="match-title">{user.ownerName}</h2>
        </div>
      </div>

      {/* Conversation history */}
      <div className="messages-container">
        {conversation?.messages?.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${
              msg.senderEmail === myEmail ? "sent" : "received"
            }`}
          >
            {msg.messageText}
          </div>
        ))}
      </div>

      {/*add keyboard/messaging functionality here*/}
      <div className="message-input-container">
        <input
          type="text"
          className="message-input"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSend}>
          <LuArrowUp className="send-arrow" />
        </button>
      </div>
    </div>
  );
};

export default ConversationPage;

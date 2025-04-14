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
    };
    fetchConversation();
  }, []);

  const handleSend = () => {
    if (newMessage.trim() !== "") {
      console.log("Sending message: ", newMessage);
      MessageService.instance.sendMessage(user.email, newMessage, myEmail);
      //sendMessage([friend, newMessage]);
      setNewMessage("");
    }
  };

  /* Simulated messages
  const messages = [
    { sender: "them", text: "Hey does your dog do any tricks??" },
    { sender: "me", text: "Yeah he just learned the 'Pee all over the carpet' one" },
    { sender: "them", text: "Oh nice mine is still working on that" },
    { sender: "me", text: "They could get together and mine could teach yours" },
  ];*/

  // const handleSend = () => {
  //   if (!input.trim()) return;

  //   // Push user input immediately
  //   setMessages((prev) => [...prev, `You: ${input}`]);

  //   // Simulate bot reply with delay (after a short timeout)
  //   setInput("");

  //   setTimeout(() => {
  //     // Add bot's reply after a delay
  //     setMessages((prev) => [...prev, `Bot: Bow Wow!🦴`]);
  //   }, 1000); // Delay of 1.0 seconds
  // };

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
        {/* <div className="messages-container">
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
        </button> */}
      </div>
    </div>
  );
};

export default ConversationPage;

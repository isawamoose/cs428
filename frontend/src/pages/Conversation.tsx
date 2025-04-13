//about half of the code on this page was added by John. 
// (mostly the bottom half)
// Don't be afraid to change something if you need to

import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LuChevronLeft } from "react-icons/lu";
import "./Conversation.css";
import ImageWithFallback from "../components/ImageWithFallback";
import { Profile } from "@shared/Profile";
import { useState } from "react";
import { useEffect } from "react";
import { MessageService } from "../services/MessageService";
import { UserService } from "../services/UserService";

const Conversation = () => {
  const [newMessage, setNewMessage] = useState("");
  const [myEmail, setMyEmail] = useState("");
  const [userService] = useState<UserService>(new UserService());
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const user = Profile.fromObject(location.state?.user) as Profile;
  const navigate = useNavigate();

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
      const conversation = await MessageService.instance.getConversation(myEmail, user.email);
      setMessages(conversation);
    } 
    fetchConversation();
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      console.log("Sending message: ", newMessage)
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
      <div className="message-history">
        {messages.map((msg, index) => (
          <div key={index}
            className={`message-bubble ${msg.sender === "me" ? "sent" : "received"}`}>
              {msg.text}
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
          onChange={(e)=> setNewMessage(e.target.value)}
        />
        <button className="send-button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Conversation;

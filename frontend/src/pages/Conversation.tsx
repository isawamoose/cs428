import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LuChevronLeft } from "react-icons/lu";
import "./Conversation.css";

const Conversation = () => {
  const location = useLocation();
  const user = location.state?.user;
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="conversation-page">
      <div className="conversation-header">
        <LuChevronLeft className="back-icon" onClick={handleBackClick} />
        <div className="conversation-info">
          <img
            src={user.imageLink}
            alt={`${user.dogName}'s profile`}
            className="conversation-image"
          />
          <h2 className="match-title">
            {user.ownerName} & {user.dogName}
          </h2>
        </div>
      </div>

      {/*add keyboard/messaging functionality here*/}
    </div>
  );
};

export default Conversation;

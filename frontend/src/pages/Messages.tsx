import "./Messages.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MatchService } from "../services/MatchService";
import { MatchProfile } from "@shared/Profile";

const Messages = () => {
  //Get all the users you've matched with to display them to talk to
  const [matchedUsers, setMatchedUsers] = useState<MatchProfile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      const users = MatchService.instance.getMatchedUsers();
      setMatchedUsers(users);

      console.log(`Total matched users: ${users.length}`);
      console.log(users);
    };

    fetchMatchedUsers();
  }, []);
  return (
    <div className="messages-page">
      <div className="messages-profile-header">
        <h1 className="messages-title">Messages</h1>
      </div>

      <div className="messages-list">
        {matchedUsers.length > 0 ? (
          matchedUsers.map((user) => (
            <div
              key={user.email}
              className="messages-card"
              onClick={
                () =>
                  navigate(`/app/messages/conversation/${user.email}`, {
                    state: { user },
                  }) //Go to conversation with selected user
              }
            >
              <img
                src={user.imageLink}
                alt={`${user.dogName}'s profile`}
                className="messages-image"
              />

              <div className="messages-details">
                <div className="messages-header">
                  <h1 className="messages-name">{user.ownerName}</h1>
                </div>

                <p className="messages-dogName">{user.dogName}'s Owner</p>
              </div>
            </div>
          ))
        ) : (
          <h1 className="no-messages">
            No conversations started yet! Match with someone to chat.
          </h1>
        )}
      </div>
    </div>
  );
};

export default Messages;

import { useEffect, useState } from "react";
import { MatchService } from "../services/MatchService";
import { Profile } from "@shared/Profile";
import "./Matches.css";
import { useNavigate } from "react-router-dom";
import ImageWithFallback from "../components/ImageWithFallback";
import { LuMessageCircle } from "react-icons/lu";

const Matches = () => {
  const [matchedUsers, setMatchedUsers] = useState<Profile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      const users = await MatchService.instance.getMatchedProfiles();
      setMatchedUsers(users);
    };

    fetchMatchedUsers();
  }, []);

  return (
    <div className="matches-page">
      <div className="match-profile-header">
        <h1 className="match-title">Matches</h1>
      </div>

      <div className="match-list">
        {matchedUsers.length > 0 ? (
          matchedUsers.map((user) => (
            <div key={user.email} className="match-wrapper">
              <div
                className="match-card"
                onClick={() => navigate(`/app/user/${user.email}`)}
              >
                <ImageWithFallback
                  src={user.imageLink}
                  alt={`${user.dogName}'s profile`}
                  className="match-image"
                />
                <div className="match-details">
                  <div className="match-header">
                    <h1 className="match-name">{user.dogName}</h1>
                    <p className="match-breed">{user.breed}</p>
                  </div>
                  <p className="match-description">{user.description}</p>
                </div>
              </div>

              {/* New wrapper for consistent sizing */}
              <div className="message-icon-wrapper">
                <LuMessageCircle
                  className="message-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/app/matches/conversation/${user.email}`, {
                      state: { user },
                    });
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <h1 className="no-matches">No matches made yet!</h1>
        )}
      </div>
    </div>
  );
};

export default Matches;

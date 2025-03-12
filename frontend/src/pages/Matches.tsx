import { useEffect, useState } from "react";
import { MatchService } from "../services/MatchService"; 
import { ShortProfile } from "@shared/Profile";
import "./Matches.css";

const Matches = () => {
  const [matchedUsers, setMatchedUsers] = useState<ShortProfile[]>([]);

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      const users = MatchService.instance.getMatchedUsers();
      setMatchedUsers(users);

      console.log(`Total matched users: ${users.length}`);
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
            <div key={user.ownerName} className="match-card">
              <img src={user.imageLink} alt={`${user.dogName}'s profile`} className="match-image" />

              <div className="match-details">
                <div className="match-header">
                  <h1 className="match-name">{user.dogName}</h1>
                  <p className="match-breed">{user.breed}</p>
                </div>

                <p className="match-description">{user.description}</p>
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

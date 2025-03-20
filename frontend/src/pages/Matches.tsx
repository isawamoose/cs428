import { useEffect, useState } from "react";
import { MatchService } from "../services/MatchService"; 
import { MatchProfile } from "@shared/Profile";
import "./Matches.css";
import { useNavigate } from "react-router-dom";

const Matches = () => {
  const [matchedUsers, setMatchedUsers] = useState<MatchProfile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      const users = MatchService.instance.getMatchedUsers();
      setMatchedUsers(users);

      console.log(`Total matched users: ${users.length}`);
      console.log(users)
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
            <div key={user.email} className="match-card" onClick={() => navigate(`/app/user/${user.email}`)}>
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

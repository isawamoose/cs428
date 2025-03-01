import { UserInfoContext } from "../components/UserInfoProvider";
import { useContext, useEffect, useState } from "react";
import { LuBone, LuThumbsDown } from 'react-icons/lu'
import './Home.css';
import { MatchService } from "../services/MatchService";

const Home = () => {
  const { authToken, displayedUser, setDisplayedUser } = useContext(UserInfoContext);
  const [matchService] = useState(new MatchService());

  const getNewUser = async () => {
    const userToDisplay = await matchService.getUnmatchedUser(authToken, displayedUser);
    setDisplayedUser(userToDisplay);
  }

  useEffect(() => {
    getNewUser();
  }, []);

  const handleLike = async () => {
    const isMatch = await matchService.match(authToken, displayedUser!.shortProfile)
    if (isMatch) {
      console.log("It's a match! Congrats!")
    }
    await getNewUser();
  }

  const handleDislike = async () => {
    await getNewUser();
  }

  if (displayedUser?.shortProfile) {
    return (
      <div className="container home-page">
        <div className="match-profile-header">
          <h1 className="match-profile-name">{displayedUser.shortProfile.name}</h1>
          <h3 className="match-profile-breed">{displayedUser.shortProfile.breed}</h3>
        </div>
        <div className="match-profile-img-container">
          <img src={displayedUser.shortProfile.imageLink} alt={`${displayedUser.shortProfile.breed} named ${displayedUser.shortProfile.name}`} className="match-profile-img" />
          <div className="match-btn-container">
            <div className="match-selection-btn" id='not-interested' onClick={handleDislike}>
              <LuThumbsDown color="#eb4034" />
            </div>
            <div className="match-selection-btn" id='interested' onClick={handleLike}>
              <LuBone color="#03c0ff" />
            </div>
          </div>
        </div>
        <div className="match-profile-description">
          <h2>Description...</h2>
          <p>{displayedUser.shortProfile.description}</p>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className="conatainer home-page">
        Loading...
      </div>
    )
  }
};

export default Home;

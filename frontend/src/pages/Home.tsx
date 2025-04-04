import { useEffect, useRef, useState } from "react";
import { LuBone, LuThumbsDown } from "react-icons/lu";
import "./Home.css";
import { MatchService } from "../services/MatchService";
import { useNavigate } from "react-router-dom";
import { Profile } from "@shared/Profile";
import noImage from "../assets/noImage.png"; // Placeholder image for when the profile image fails to load

interface Props {
  user: Profile | null;
}

const Home = (props: Props) => {
  const [displayedUser, setDisplayedUser] = useState<Profile | null>(null);
  const matchService = MatchService.instance;
  const [email, setEmail] = useState<string>("");
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const navigate = useNavigate();

  const getNewUser = async () => {
    const userToDisplay: Profile | null = await matchService.getNextUser();
    setDisplayedUser(userToDisplay);
  };

  useEffect(() => {
    getNewUser();
  }, []);

  const handleLike = async () => {
    const [isMatch, email] = await matchService.like(displayedUser!);
    if (isMatch) {
      setEmail(email);
      dialogRef.current?.showModal();
    } else {
      await getNewUser();
    }
  };

  const handleDislike = async () => {
    await matchService.dislike(displayedUser!);
    await getNewUser();
  };

  const closeModal = async () => {
    dialogRef.current?.close();
    await getNewUser();
  };

  const startTalking = () => {
    dialogRef.current?.close();
    navigate(`/app/user/${email}`);
  };

  if (displayedUser) {
    return (
      <div className="container home-page">
        {/* Modal to indicate a mutual match */}
        <dialog ref={dialogRef} className="match-modal">
          <h2>It looks like {displayedUser.dogName} left you a bone too!</h2>
          <p>
            Contact {displayedUser.ownerName} to set up a time and place for{" "}
            {props.user!.dogName} and {displayedUser.dogName} to meet.
          </p>
          <div className="modal-button-options">
            <button className="btn-blue" onClick={startTalking}>
              Start Talking
            </button>
            <button onClick={closeModal}>Close</button>
          </div>
        </dialog>

        <div className="match-profile-header">
          <h1 className="match-profile-name">{displayedUser.ownerName}</h1>
          <h3 className="match-profile-breed">{displayedUser.breed}</h3>
        </div>
        <div className="match-profile-img-container">
          <img
            src={displayedUser.imageLink ?? noImage}
            alt={`${displayedUser.breed} named ${displayedUser.dogName}`}
            className="match-profile-img"
            onError={(e) => {
              (e.target as HTMLImageElement).src = noImage; // Fallback to placeholder image if the original fails to load
            }}
          />
          <div className="match-btn-container">
            <div
              className="match-selection-btn"
              id="not-interested"
              onClick={handleDislike}
            >
              <LuThumbsDown color="#eb4034" />
            </div>
            <div
              className="match-selection-btn"
              id="interested"
              onClick={handleLike}
            >
              <LuBone color="#03c0ff" />
            </div>
          </div>
        </div>
        <div className="match-profile-description">
          <h2>Description</h2>
          <p>{displayedUser.description}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container home-page message">
        <h2>There are currently no users to display.</h2>
      </div>
    );
  }
};

export default Home;

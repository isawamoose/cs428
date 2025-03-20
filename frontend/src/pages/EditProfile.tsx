import { Profile } from "@shared/Profile";
import "./EditProfile.css";
import { UserService } from "../services/UserService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuChevronLeft } from "react-icons/lu";

interface Props {
  user: Profile;
  setUser: (user: Profile) => void;
}

const EditProfile = (props: Props) => {
  const [dogName, setDogName] = useState(props.user.dogName);
  const [breed, setBreed] = useState(props.user.breed);
  const [description, setDescription] = useState(props.user.description);
  const [ownerName, setOwnerName] = useState(props.user.ownerName);

  const navigate = useNavigate();
  const [service] = useState(new UserService());

  // this calls update and then sends user back to ProfileSettings Page
  const handleUpdate = async () => {
    await service.updateProfile(
      new Profile(
        props.user.email,
        dogName,
        breed,
        description,
        ownerName,
        props.user.imageLink
      ),
      props.setUser
    );
    navigate(-1);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-features">
        <LuChevronLeft className="back-icon" onClick={handleBackClick} />
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="edit-profile-pic">
            <img
              className="edit-image"
              src={props.user.imageLink}
              alt={props.user.dogName}
            />
          </div>

          <div>
            <h2 className="email">Email: {props.user.email}</h2>
          </div>

          <div>
            <h2>Dog's Name</h2>
            <input
              type="text"
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              placeholder="Enter dog name"
            />
          </div>

          <div>
            <h2>Dog's Breed</h2>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Enter breed"
            />
          </div>

          <div>
            <h2>Dog's Personality</h2>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div>
            <h2>Your Name</h2>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Enter owner name"
            />
          </div>

          <button
            className="edit-submit reg_button"
            type="button"
            onClick={handleUpdate}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

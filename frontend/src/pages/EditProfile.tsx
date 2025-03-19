import { Profile } from "@shared/Profile";
import "./EditProfile.css";
import { LoginService } from "../services/LoginService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuChevronLeft } from "react-icons/lu";

interface Props {
  user: Profile | null;
}

const EditProfile = ({ user }: Props) => {
  const [email, setEmail] = useState(user?.email ?? "");
  const [dogName, setDogName] = useState(user?.dogName ?? "");
  const [breed, setBreed] = useState(user?.breed ?? "");
  const [description, setDescription] = useState(user?.description ?? "");
  const [ownerName, setOwnerName] = useState(user?.ownerName ?? "");
  const [imageLink, setImageLink] = useState(user?.imageLink ?? "");

  const navigate = useNavigate();
  const [service] = useState(new LoginService());

  //this calls update and then sends user back to ProfileSettings Page
  const handleUpdate = async () => {
    //await service.updateAccount();
    //alert("Profile updated successfully!");
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
              src={user?.imageLink}
              alt={user?.dogName}
            />
          </div>

          <div>
            <h2>Email</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
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

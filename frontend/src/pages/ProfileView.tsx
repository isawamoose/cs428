import { Profile } from "@shared/Profile";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MatchService } from "../services/MatchService";
import { UserService } from "../services/UserService";
import "../pages/Home.css";
// Imported Home.css because this page has very similar styles

const ProfileView = () => {
  // if the path is "/app/user/:email" -- use the email to find the user
  // if the path us "/app/user" -- display the currently logged in user

  const { email } = useParams();
  const [userService] = useState<UserService>(new UserService());
  const [profile, setProfile] = useState<Profile | null>();

  useEffect(() => {
    fetchUserInfo();
  }, [email]);

  async function fetchUserInfo() {
    if (email) {
      MatchService.instance.getUser(email).then((p) => setProfile(p));
    } else {
      userService.getProfile().then((p) => setProfile(p));
    }
  }

  if (profile) {
    return (
      <div className="container profile-view" style={{ overflow: "hidden" }}>
        <div className="match-profile-header">
          <h1 className="match-profile-name">{profile?.dogName}</h1>
          <h3 className="match-profile-breed">{profile?.breed}</h3>
        </div>

        <div className="match-profile-img-container">
          <img
            src={profile?.imageLink}
            alt={`${profile?.breed} named ${profile?.dogName}`}
            className="match-profile-img"
          />
        </div>

        <div className="match-profile-description">
          <h2>Description</h2>
          <p>{profile?.description}</p>
        </div>

        <div
          className="match-profile-description"
          style={{ margin: "1.5rem 0" }}
        >
          <h2>Contact</h2>
          <p>
            Reach out to {profile?.ownerName} at{" "}
            <a href={`mailto:${profile?.email}`} style={{ color: "#038eff" }}>
              {profile?.email}
            </a>{" "}
            to set up a time and place to meet
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#038eff", padding: "1rem" }}>
          Sorry, we couldn't find this profile.
        </h1>
        <Link
          to="/app"
          style={{
            color: "#038eff",
            fontSize: "1.25rem",
            textDecoration: "underline",
          }}
        >
          Back Home
        </Link>
      </div>
    );
  }
};

export default ProfileView;

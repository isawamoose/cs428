import { UserInfoContext } from "../components/UserInfoProvider";
import { useContext, useEffect } from "react";

const Home = () => {
  const { currentUser, authToken } = useContext(UserInfoContext);

  //THIS WAS JUST FOR TESTING IF PROFILE INFORMATION WAS BEING STORED CORRECTLY AFTER LOGGING IN, FEEL FREE TO DELETE
  useEffect(() => {
    // Log the user info (even if not logged in)
    if (currentUser) {
      console.log("Stored User Info:", currentUser.shortProfile);
    } else {
      console.log("No user logged in");
    }
  }, [currentUser, authToken]); // Re-run when currentUser or authToken changes

  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to the home page!</p>
    </div>
  );
};

export default Home;

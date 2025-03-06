import { createContext, useState, ReactNode } from "react";
import { Profile } from "@shared/Profile";

/**
 * Used to store user/profile information to be accessed
 * across the different pages after logging in.
 */

// Constants for localStorage keys
const CURRENT_USER_KEY = "CurrentUserKey";

// Define the structure of user information in the context
interface UserInfo {
  currentUser: Profile | null;
  displayedUser: Profile | null;
  setCurrentUser: (currentUser: Profile) => void;
  clearUserInfo: () => void;
  setDisplayedUser: (user: Profile) => void;
}

const defaultUserInfo: UserInfo = {
  currentUser: null,
  displayedUser: null,
  setCurrentUser: () => {},
  clearUserInfo: () => {},
  setDisplayedUser: () => {},
};

// Create a context for user information
export const UserInfoContext = createContext<UserInfo>(defaultUserInfo);

interface Props {
  children: ReactNode;
}

const UserInfoProvider: React.FC<Props> = ({ children }) => {
  // Save user info to localStorage
  const saveToLocalStorage = (currentUser: Profile): void => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser)); // Serialize and store user profile
  };

  // Retrieve user info from localStorage
  const retrieveFromLocalStorage = (): {
    currentUser: Profile | null;
    displayedUser: Profile | null;
  } => {
    const loggedInUser = localStorage.getItem(CURRENT_USER_KEY);

    if (loggedInUser) {
      return {
        currentUser: JSON.parse(loggedInUser), // Deserialize and return user profile
        displayedUser: JSON.parse(loggedInUser), // Set displayedUser as the logged-in user
      };
    } else {
      return { currentUser: null, displayedUser: null };
    }
  };

  // Clear user info from localStorage
  const clearLocalStorage = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  // Initialize user state from localStorage or default values
  const [userInfo, setUserInfo] = useState({
    ...defaultUserInfo,
    ...retrieveFromLocalStorage(),
  });

  // Update user info and save it to localStorage
  const setCurrentUser = (currentUser: Profile) => {
    //console.log("Inside updateUserInfo function");
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo, // Spread previous state to retain methods
      currentUser
    }));
    // Save the updated user info to localStorage
    saveToLocalStorage(currentUser);
  };

  // Clear user info from context and localStorage
  const clearUserInfo = () => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo, // Spread previous state to retain methods
      currentUser: null,
      displayedUser: null,
    }));
    clearLocalStorage(); // Remove data from localStorage
  };

  // Set the displayed user info
  const setDisplayedUser = (user: Profile) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo, // Spread previous state to retain methods
      displayedUser: user,
    }));
  };

  // Provide the user info and methods to update or clear it through context
  return (
    <UserInfoContext.Provider
      value={{
        ...userInfo,
        setCurrentUser,
        clearUserInfo,
        setDisplayedUser,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;

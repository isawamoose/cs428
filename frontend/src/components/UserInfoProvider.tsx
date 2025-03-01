import { createContext, useState, ReactNode } from "react";
import { Profile } from "@shared/Profile";
import { AuthToken } from "@shared/util/AuthToken";

/**
 * Used to store user/profile information to be accessed
 * across the different pages after logging in.
 */

// Constants for localStorage keys
const CURRENT_USER_KEY = "CurrentUserKey";
const AUTH_TOKEN_KEY = "AuthTokenKey";

// Define the structure of user information in the context
interface UserInfo {
  currentUser: Profile | null;
  displayedUser: Profile | null;
  authToken: AuthToken | null;
  updateUserInfo: (
    currentUser: Profile,
    displayedUser: Profile | null,
    authToken: AuthToken
  ) => void;
  clearUserInfo: () => void;
  setDisplayedUser: (user: Profile) => void;
}

const defaultUserInfo: UserInfo = {
  currentUser: null,
  displayedUser: null,
  authToken: null,
  updateUserInfo: () => {},
  clearUserInfo: () => {},
  setDisplayedUser: () => {},
};

// Create a context for user information
export const UserInfoContext = createContext<UserInfo>(defaultUserInfo);

interface Props {
  children: ReactNode;
}

const UserInfoProvider: React.FC<Props> = ({ children }) => {
  // Save user info and auth token to localStorage
  const saveToLocalStorage = (
    currentUser: Profile,
    authToken: AuthToken
  ): void => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser)); // Serialize and store user profile
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authToken)); // Serialize and store auth token
  };

  // Retrieve user info and auth token from localStorage
  const retrieveFromLocalStorage = (): {
    currentUser: Profile | null;
    displayedUser: Profile | null;
    authToken: AuthToken | null;
  } => {
    const loggedInUser = localStorage.getItem(CURRENT_USER_KEY);
    const authToken = localStorage.getItem(AUTH_TOKEN_KEY);

    if (loggedInUser && authToken) {
      return {
        currentUser: JSON.parse(loggedInUser), // Deserialize and return user profile
        displayedUser: JSON.parse(loggedInUser), // Set displayedUser as the logged-in user
        authToken: JSON.parse(authToken), // Deserialize and return auth token
      };
    } else {
      return { currentUser: null, displayedUser: null, authToken: null };
    }
  };

  // Clear user info and auth token from localStorage
  const clearLocalStorage = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  // Initialize user state from localStorage or default values
  const [userInfo, setUserInfo] = useState({
    ...defaultUserInfo,
    ...retrieveFromLocalStorage(),
  });

  // Update user info and save it to localStorage
  const updateUserInfo = (
    currentUser: Profile,
    displayedUser: Profile | null,
    authToken: AuthToken
  ) => {
    //console.log("Inside updateUserInfo function");
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo, // Spread previous state to retain methods
      currentUser,
      displayedUser,
      authToken,
    }));
    // Save the updated user info to localStorage
    saveToLocalStorage(currentUser, authToken);
  };

  // Clear user info from context and localStorage
  const clearUserInfo = () => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo, // Spread previous state to retain methods
      currentUser: null,
      displayedUser: null,
      authToken: null,
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
        updateUserInfo,
        clearUserInfo,
        setDisplayedUser,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;

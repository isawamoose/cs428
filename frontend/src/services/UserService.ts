import { apiClient } from "../api/ApiClient";
import { Profile } from "@shared/Profile";

export class UserService {
  public async login(
    email: string,
    password: string,
    setUser: (user: Profile) => void
  ) {
    try {
      await apiClient.login(email, password);
      const profile = await apiClient.getProfile();
      if (!profile) {
        throw new Error();
      }
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
      return profile;
    } catch (error: unknown) {
      console.error("Login failed.", (error as Error).message);
      return null;
    }
  }

  public async register(
    newProfile: Profile,
    password: string,
    file: File,
    setUser: (user: Profile) => void
  ) {
    try {
      await apiClient.register(password, newProfile);
      let profile = await apiClient.getProfile();
      if (!profile) {
        throw new Error();
      }

      const photoURL = await apiClient.uploadPhoto(file, newProfile.email)
      if (photoURL) {
        profile = new Profile(profile.email, profile.dogName, profile.breed, profile.description, profile.ownerName, photoURL);
      }
  
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
      return profile;
    } catch (error: unknown) {
      console.error("Registration failed.", (error as Error).message);
      return null;
    }
  }

  public async getProfile(): Promise<Profile | null> {
    try {
      return await apiClient.getProfile();
    } catch (error: unknown) {
      console.error("Failed to get profile.", (error as Error).message);
      return null;
    }
  }

  public async updateProfile(
    newProfile: Profile,
    setUser: (user: Profile) => void
  ): Promise<Profile | null> {
    try {
      const profile = await apiClient.updateProfile(newProfile);
      if (!profile) {
        throw new Error();
      }
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
      return profile;
    } catch (error: unknown) {
      console.error("Failed to update profile.", (error as Error).message);
      return null;
    }
  }

  public async logout(): Promise<void> {
    try {
      apiClient.logout();
    } catch (error: unknown) {
      console.error("Failed to logout.", (error as Error).message);
    }
  }

  public async deleteAccount(): Promise<void> {
    try {
      apiClient.deleteAccount();
    } catch (error: unknown) {
      console.error("Failed to delete account.", (error as Error).message);
    }
  }

  private async uploadPhoto(file: File, email: string): Promise<string> {
    return await apiClient.uploadPhoto(file, email)
  }

  //just putting this here for now, will need to connect to back end
  public async updateAccount(): Promise<void> {}
}

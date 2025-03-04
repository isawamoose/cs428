import { apiClient } from "../api/ApiClient";
import { Profile } from "@shared/Profile";
// import { Profile } from "@shared/Profile";

export class LoginService {
  public async login(username: string, password: string) {
    try {
      await apiClient.login(username, password);
      const profile = await apiClient.getProfile();
      console.log("profile", profile);
    } catch (error: unknown) {
      console.error("Login failed.", (error as Error).message);
    }
  }

  // public async register(profile: Profile) {
  //   try {
  //     await apiClient.register("password", profile!);
  //   } catch (error: unknown) {
  //     console.error("Registration failed.", (error as Error).message);
  //   }
  // }

  public async register(profile: Profile) {
    try {
      await apiClient.register("password", profile);
    } catch (error: unknown) {
      console.error("Registration failed.", (error as Error).message);
    }
  }

  public async getProfile() {
    try {
      return await apiClient.getProfile();
    } catch (error: unknown) {
      console.error("Failed to get profile.", (error as Error).message);
      return null;
    }
  }
}

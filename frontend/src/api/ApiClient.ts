import { MatchProfile, Profile, ProfileObject } from "@shared/Profile";
import { ApiRequest } from "./Request";

class ApiClient {
  private apiRequest: ApiRequest = new ApiRequest();
  async login(email: string, password: string): Promise<void> {
    const body = { email, password };
    await this.apiRequest.request("login", "PUT", body);
  }

  async register(password: string, profile: Profile): Promise<void> {
    const body = { password, profile };
    await this.apiRequest.request("register", "POST", body);
  }

  async getProfile(): Promise<Profile> {
    const response: ProfileObject = (await this.apiRequest.request(
      "profile",
      "GET"
    )) as ProfileObject;
    return Profile.fromObject(response);
  }

  async updateProfile(profile: Profile): Promise<Profile> {
    const body = { profile };
    const response: ProfileObject = (await this.apiRequest.request(
      "profile",
      "PUT",
      body
    )) as ProfileObject;
    return Profile.fromObject(response);
  }

  async logout(): Promise<void> {
    await this.apiRequest.request("logout", "DELETE");
  }

  async deleteAccount(): Promise<void> {
    await this.apiRequest.request("profile", "DELETE");
  }

  async getMatchedProfiles(): Promise<MatchProfile[]> {
    const response: MatchProfile[] = (await this.apiRequest.request(
      "matches",
      "GET"
    )) as MatchProfile[];
    return response;
  }
}

const apiClient = new ApiClient();

export { apiClient };

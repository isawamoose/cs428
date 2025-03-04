import { Profile, ProfileObject } from "@shared/Profile";
import { ApiRequest } from "./Request";

class ApiClient {
  private apiRequest: ApiRequest = new ApiRequest();
  async login(username: string, password: string): Promise<void> {
    const body = { username, password };
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
    const profile = Profile.fromObject(response);
    return profile;
  }
}

const apiClient = new ApiClient();

export { apiClient };

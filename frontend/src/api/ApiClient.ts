import { Profile, ProfileObject } from "@shared/Profile";
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
    const profile = Profile.fromObject(response);
    return profile;
  }

  async logout(): Promise<void> {
    await this.apiRequest.request("logout", "DELETE");
  }

  async deleteAccount(): Promise<void> {
    // This does not currentlly delete an account
    // This is just here for manual testing purposes
    // This function still needs to be correctly implemented
    await this.apiRequest.request("logout", "DELETE");
  }
}

const apiClient = new ApiClient();

export { apiClient };

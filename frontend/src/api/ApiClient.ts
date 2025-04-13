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

  async getMatchedProfiles(): Promise<Profile[]> {
    const response: ProfileObject[] = (await this.apiRequest.request(
      "matches",
      "GET"
    )) as ProfileObject[];
    return response.map((profileObj) => Profile.fromObject(profileObj));
  }

  async getUnvotedProfiles(): Promise<Profile[]> {
    const response: ProfileObject[] = (await this.apiRequest.request(
      "unvoted",
      "GET"
    )) as ProfileObject[];
    return response.map((profileObj) => Profile.fromObject(profileObj));
  }

  async like(likeeEmail: string): Promise<boolean> {
    const body = { likeeEmail };
    const response: { isMatch: boolean } = (await this.apiRequest.request(
      "like",
      "POST",
      body
    )) as { isMatch: boolean };
    return response.isMatch;
  }

  async dislike(dislikeeEmail: string): Promise<void> {
    const body = { dislikeeEmail };
    await this.apiRequest.request("dislike", "POST", body);
  }

  async uploadPhoto(file: File, key: string): Promise<string> {

    interface Response {
      url: string
    }

    const body = await file.arrayBuffer()
    const headers = new Headers({
      "Content-type": file.type,
      "X-User-Email": key
    })
    console.log(headers)
    const response = (await this.apiRequest.request("photo", "POST", body, headers) as Response)
    return response.url
  }

  //this last function was added by John for messaging functionality
  //Don't hesitate to change if necessary

  async sendMessage(friendEmail: string, message: string, myEmail: string): Promise<void> {
    const body = { 
      friendEmail,
      message,
      myEmail,
    }
    console.log("in api client");
    await this.apiRequest.request("message", "POST", body);
  }

  //and John added this function too
  async getConversation(userEmail: string, matchEmail: string): Promise<Array<string>> {
    console.log("In getconversation of apiClient");
    const body = {
      userEmail,
      matchEmail,
    }
    const messages = await this.apiRequest.request("conversation", "GET", body);
    return messages as string[]; 
  }

}

const apiClient = new ApiClient();

export { apiClient };

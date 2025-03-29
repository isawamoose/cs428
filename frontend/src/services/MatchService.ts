import { Profile } from "@shared/Profile";
import { apiClient } from "../api/ApiClient";

export class MatchService {
  private static _instance: MatchService;
  private matchedUsers: Profile[] = [];
  private unlikedProfiles: Profile[] = [];
  private matchIndex = 0;

  // Singleton instance
  public static get instance(): MatchService {
    if (!this._instance) {
      this._instance = new MatchService();
    }
    return this._instance;
  }

  private constructor() {}

  public async getUnlikedProfiles(): Promise<Profile[]> {
    const unlikedProfiles = await apiClient.getUnlikedProfiles();
    this.unlikedProfiles = unlikedProfiles;
    this.matchIndex = 0; // Reset index for new unliked profiles
    return this.unlikedProfiles;
  }

  public async like(otherUser: Profile): Promise<[boolean, string]> {
    const isMatch = await apiClient.like(otherUser.email);
    let email = "";

    if (isMatch) {
      await this.getMatchedProfiles(); // Refresh matched profiles
      email = otherUser.email;
    }

    return [isMatch, email];
  }

  public async getMatchedProfiles(): Promise<Profile[]> {
    const matchedProfiles = await apiClient.getMatchedProfiles();
    this.matchedUsers = matchedProfiles;
    return this.matchedUsers;
  }

  public async getUser(email: string | undefined): Promise<Profile | null> {
    if (!this.matchedUsers.length) {
      await this.getMatchedProfiles(); // Fetch matched profiles if empty
    }
    return this.matchedUsers.find((profile) => profile.email === email) || null;
  }

  public async getNextUser(): Promise<Profile | null> {
    if (!this.unlikedProfiles.length) {
      await this.getUnlikedProfiles(); // Fetch unliked profiles if empty
    }
    if (this.unlikedProfiles.length) {
      const nextUser = this.unlikedProfiles[this.matchIndex];
      this.matchIndex = (this.matchIndex + 1) % this.unlikedProfiles.length; // Increment and wrap around
      return nextUser;
    }
    return null;
  }
}

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
    console.log("Unliked profiles:", this.unlikedProfiles);
    this.matchIndex = 0; // Reset index for new unliked profiles
    return this.unlikedProfiles;
  }

  public async match(otherUser: Profile): Promise<[boolean, string]> {
    console.log("Attempting to match with:", otherUser);
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

  public getUser(email: string | undefined): Profile | null {
    return this.matchedUsers.find((profile) => profile.email === email) || null;
  }

  public async getNextUser(): Promise<Profile | null> {
    if (!this.unlikedProfiles.length) {
      await this.getUnlikedProfiles(); // Fetch unliked profiles if empty
    }
    if (this.matchIndex < this.unlikedProfiles.length - 1) {
      const nextUser = this.unlikedProfiles[this.matchIndex];
      this.matchIndex++;
      return nextUser;
    } else {
      this.matchIndex = 0; // Reset index if no more users
    }
    return null;
  }
}

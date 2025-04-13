import { Profile } from "@shared/Profile";
import { apiClient } from "../api/ApiClient";

export class MatchService {
  private static _instance: MatchService;
  private matchedUsers: Profile[] = [];
  private unvotedProfiles: Profile[] = [];
  private matchIndex = 0;

  // Singleton instance
  public static get instance(): MatchService {
    if (!this._instance) {
      this._instance = new MatchService();
    }
    return this._instance;
  }

  private constructor() {}

  public async getUnvotedProfiles(): Promise<Profile[]> {
    const unvotedProfiles = await apiClient.getUnvotedProfiles();
    this.unvotedProfiles = unvotedProfiles;
    this.matchIndex = 0; // Reset index for new unliked profiles
    return this.unvotedProfiles;
  }

  public async like(otherUser: Profile): Promise<[boolean, string]> {
    const isMatch = await apiClient.like(otherUser.email);
    let email = "";

    if (isMatch) {
      await this.getMatchedProfiles(); // Refresh matched profiles
      email = otherUser.email;
      //console.log("here");
    }

    await this.getUnvotedProfiles(); // Refresh unliked profiles

    return [isMatch, email];
  }

  public async dislike(otherUser: Profile): Promise<void> {
    await apiClient.dislike(otherUser.email);
    await this.getUnvotedProfiles(); // Refresh unliked profiles
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
    if (!this.unvotedProfiles.length) {
      await this.getUnvotedProfiles(); // Fetch unliked profiles if empty
    }
    if (this.unvotedProfiles.length) {
      let nextUser = this.unvotedProfiles[this.matchIndex];
      this.matchIndex = (this.matchIndex + 1) % this.unvotedProfiles.length; // Increment and wrap around
      // FIXME we need a better way to handle bad images
      if (nextUser.imageLink === "") {
        nextUser = new Profile(
          nextUser.email,
          nextUser.dogName,
          nextUser.breed,
          nextUser.description,
          nextUser.ownerName,
          "fakeUrl"
        );
      }
      return nextUser;
    }
    return null;
  }
}

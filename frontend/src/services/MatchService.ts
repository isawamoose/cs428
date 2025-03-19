import { ShortProfile, MatchProfile } from "@shared/Profile";
import { FakeData } from "@shared/util/FakeData";

export class MatchService {
  private static _instance: MatchService;
  private matchedUsers: MatchProfile[] = [];

  // Singleton instance
  public static get instance(): MatchService {
    if (!this._instance) {
      this._instance = new MatchService();
    }
    return this._instance;
  }

  private constructor() {} 

  public async getUnmatchedUser(): Promise<ShortProfile> {
    const newUser = FakeData.instance.getRandomUser();
    return newUser;
  }

  public async match(otherUser: ShortProfile): Promise<boolean> {
    const isMatch = Math.random() > 0.75;

    if (isMatch) {

      // This is kinda hacky
      // Once this functionality exists on the backend, we should send the short profile and get the match profile back 
      const matchProfile = FakeData.instance.getFakeUsers().filter((profile) => {
        return JSON.stringify(otherUser) == JSON.stringify(profile.shortProfile)
      })[0].matchProfile

      this.matchedUsers.push(matchProfile);
    }

    return isMatch;
  }

  public getMatchedUsers(): MatchProfile[] {
    return this.matchedUsers;
  }
}

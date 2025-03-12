import { ShortProfile } from "@shared/Profile";
import { FakeData } from "@shared/util/FakeData";

export class MatchService {
  private static _instance: MatchService;
  private matchedUsers: ShortProfile[] = [];

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
      this.matchedUsers.push(otherUser);
    }

    return isMatch;
  }

  public getMatchedUsers(): ShortProfile[] {
    return this.matchedUsers;
  }
}

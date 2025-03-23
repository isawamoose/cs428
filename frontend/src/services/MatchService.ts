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

  public async match(otherUser: ShortProfile): Promise<[boolean, string]> {
    const isMatch = Math.random() > 0.75;
    let email = ''

    if (isMatch) {

      // This is kinda hacky
      // Once this functionality exists on the backend, we should send the short profile and get the match profile back 
      const matchProfile = FakeData.instance.getFakeUsers().find((profile) => {
        return JSON.stringify(otherUser) == JSON.stringify(profile.shortProfile)
      })!.matchProfile

      this.matchedUsers.push(matchProfile);
      email = matchProfile.email
    }

    return [isMatch, email];
  }

  public getMatchedUsers(): MatchProfile[] {
    return this.matchedUsers;
  }

  public getUser(email: string | undefined): MatchProfile | null {
    return this.matchedUsers.find(profile => profile.email === email) || null;
  }
}

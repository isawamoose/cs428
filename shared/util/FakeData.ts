import { AuthToken } from "./AuthToken";
import { Profile, ShortProfile } from "../Profile";

//just included images as strings, hopefully this work, if not save images into a shared assets folder I guess
const FRENCH_BULL: string =
  "https://images.unsplash.com/photo-1531842477197-54acf89bff98?q=80&w=2481&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const SHIBA_INU: string =
  "https://images.unsplash.com/photo-1618173745201-8e3bf8978acc?q=80&w=3930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const WELSH_CORGI: string =
  "https://images.unsplash.com/photo-1612940960267-4549a58fb257?q=80&w=3841&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

/*** The FakeData class provides mock data for the front-end,
 * including a generated authentication token and a list of
 * predefined user profiles. It follows a singleton pattern
 * to ensure only one instance is used throughout the application.*/
export class FakeData {
  private readonly _authToken: AuthToken = AuthToken.Generate();

  public get authToken() {
    return this._authToken;
  }

  //Put as many fake users as we need here
  private readonly fakeUsers: Profile[] = [
    new Profile(
      "bailey@gmail.com",
      "Scout",
      "French Bull Dog",
      "Freindly, and playful little pup",
      "Bailey",
      FRENCH_BULL
    ),
    new Profile(
      "jasmine@gmail.com",
      "Momo",
      "Shiba Inu",
      "Energetic and friendly dogs",
      "Jasmine",
      SHIBA_INU
    ),
    new Profile(
      "todd@gmail.com",
      "Lucky",
      "Weslh Corgi",
      "Relaxed and quiet dogs",
      "Todd",
      WELSH_CORGI
    ),
  ];

  public getFakeUsers(): Profile[] {
    return this.fakeUsers;
  }

  public getNextUser(lastUser: Profile | null): ShortProfile {
    const index = lastUser
      ? this.fakeUsers.findIndex((user) => user == lastUser) + 1
      : 0;
    return this.fakeUsers[index % this.fakeUsers.length].shortProfile;
  }

  public getRandomUser(): ShortProfile {
    return this.fakeUsers[Math.floor(Math.random() * this.fakeUsers.length)]
      .shortProfile;
  }

  private static _instance: FakeData;

  // Returns the singleton instance.
  public static get instance(): FakeData {
    if (FakeData._instance == null) {
      FakeData._instance = new FakeData();
    }

    return this._instance;
  }

  // Returns the first fake user, or null if there are no fake users.
  public get firstUser(): Profile | null {
    return this.fakeUsers.length > 0 ? this.fakeUsers[0] : null;
  }
}

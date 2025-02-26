import { FakeData } from "../../shared/util/FakeData";
import { Profile } from "../../shared/Profile";
import { AuthToken } from "../../shared/util/AuthToken";

export class LoginService {
  public async login(
    username: string,
    password: string
  ): Promise<[Profile, AuthToken]> {
    // TODO: Replace with the result of calling the server
    let userProfile = FakeData.instance.firstUser; // for now get the first of the fake users to use for login

    if (userProfile === null) {
      throw new Error("Invalid alias or password");
    }

    return [userProfile, FakeData.instance.authToken];
  }
}

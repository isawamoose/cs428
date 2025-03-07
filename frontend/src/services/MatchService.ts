import { ShortProfile } from "@shared/Profile";
import { FakeData } from "@shared/util/FakeData";

export class MatchService {
  public async getUnmatchedUser(): Promise<ShortProfile> {
    const newUser = FakeData.instance.getRandomUser();
    return newUser;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async match(otherUser: ShortProfile): Promise<boolean> {
    return Math.random() > 0.75;
  }
}

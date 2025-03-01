import { Profile, ShortProfile } from "@shared/Profile";
import { AuthToken } from "@shared/util/AuthToken";
import { FakeData } from "@shared/util/FakeData";

export class MatchService {
	public async getUnmatchedUser(token: AuthToken | null, lastUser: Profile | null): Promise<Profile> {
		const user = FakeData.instance.getNextUser(lastUser);
		return user;
	}

	public async match(token: AuthToken | null, otherUser: ShortProfile): Promise<boolean> {
		return Math.random() > 0.75
	}
}
import { Profile, ShortProfile } from "@shared/Profile";
import { AuthToken } from "@shared/util/AuthToken";
import { FakeData } from "@shared/util/FakeData";

export class MatchService {
	public async getUnmatchedUser(lastUser: Profile | null): Promise<Profile> {
		const user = FakeData.instance.getNextUser(lastUser);
		return user;
	}

	public async match(otherUser: ShortProfile): Promise<boolean> {
		return Math.random() > 0.75
	}
}
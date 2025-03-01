import { Database } from "../database/Database";
import { Profile } from "../shared/Profile";

export class UserService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async register(profile: Profile, password: string): Promise<boolean> {
    // Add full profile to user table
    const addUserProfileSuccess = await this.db.addUserProfile(profile);
    if (!addUserProfileSuccess) {
      return false;
    }
    // Add username and password to auth table
    const addAuthUserSuccess = await this.db.addAuthUser(
      profile.username,
      password
    );
    if (!addAuthUserSuccess) {
      // If adding the auth user fails, delete the user profile
      await this.db.deleteUserProfile(profile.username);
    }
    return addAuthUserSuccess;
  }

  async login(username: string, password: string): Promise<boolean> {
    return await this.db.validateAuthUser(username, password);
  }
}

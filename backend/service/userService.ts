import { Database } from "../database/Database";
import { Profile } from "@shared/Profile";
import { v4 as uuidv4 } from "uuid";

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
    const addAuthUserSuccess = await this.db.addUserAuth(
      profile.username,
      password
    );
    if (!addAuthUserSuccess) {
      // If adding the auth user fails, delete the user profile
      await this.db.deleteUserProfile(profile.username);
    }
    return addAuthUserSuccess;
  }

  async login(username: string, password: string): Promise<string | null> {
    const isValidUser = await this.db.validateUserAuth(username, password);
    if (isValidUser) {
      const token = this.generateToken();
      await this.db.addToken(username, token);
      return token;
    }
    return null;
  }

  async logout(username: string): Promise<boolean> {
    return await this.db.deleteToken(username);
  }

  async getUsernameFromToken(token: string): Promise<string | null> {
    return await this.db.getUsernameFromToken(token);
  }

  async getUserProfile(username: string): Promise<Profile | null> {
    return await this.db.getUserProfile(username);
  }

  async updateUserProfile(profile: Profile): Promise<boolean> {
    return await this.db.updateUserProfile(profile);
  }

  generateToken(): string {
    return uuidv4();
  }
}

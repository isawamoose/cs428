import { Database } from "../database/Database";
import { Profile } from "../../shared/Profile";
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
    // Add email and password to auth table
    const addAuthUserSuccess = await this.db.addUserAuth(
      profile.email,
      password
    );
    if (!addAuthUserSuccess) {
      // If adding the auth user fails, delete the user profile
      await this.db.deleteUserProfile(profile.email);
    }
    return addAuthUserSuccess;
  }

  async login(email: string, password: string): Promise<string | null> {
    const isValidUser = await this.db.validateUserAuth(email, password);
    if (isValidUser) {
      const token = this.generateToken();
      await this.db.addToken(email, token);
      return token;
    }
    return null;
  }

  async logout(email: string): Promise<boolean> {
    return await this.db.deleteToken(email);
  }

  async getUsernameFromToken(token: string): Promise<string | null> {
    return await this.db.getEmailFromToken(token);
  }

  async getUserProfile(email: string): Promise<Profile | null> {
    return await this.db.getUserProfile(email);
  }

  async updateUserProfile(email: string, profile: Profile): Promise<boolean> {
    if (email !== profile.email) {
      return false;
    }
    return await this.db.updateUserProfile(profile);
  }

  generateToken(): string {
    return uuidv4();
  }
}

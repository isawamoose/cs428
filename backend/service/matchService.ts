import { Profile } from "@shared/Profile";
import { Database } from "../database/Database";

export class MatchService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getUnvotedProfiles(email: string): Promise<Profile[]> {
    const unvotedProfiles = await this.db.getUnvotedProfiles(email);
    return unvotedProfiles;
  }

  //   Add a like to the like table and return true if that like results in a match
  async like(likerEmail: string, likeeEmail: string): Promise<boolean> {
    const addLikeSuccess = await this.db.addLike(likerEmail, likeeEmail);
    if (!addLikeSuccess) throw new Error("Could not add like to likers table");
    return await this.db.checkMatchAndAdd(likerEmail, likeeEmail);
  }

  //   Add a dislike to the like table
  async dislike(likerEmail: string, likeeEmail: string): Promise<boolean> {
    const addDislikeSuccess = await this.db.addDislike(likerEmail, likeeEmail);
    if (!addDislikeSuccess)
      throw new Error("Could not add dislike to likers table");
    return true;
  }

  async getMatches(email: string): Promise<Profile[]> {
    const matches = await this.db.getMatches(email);
    return matches;
  }
}

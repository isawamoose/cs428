import { MatchProfile } from "@shared/Profile";
import { Database } from "../database/Database";

export class MatchService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  //   Add a like to the like table and return true if that like results in a match
  async like(liker: MatchProfile, likee: MatchProfile): Promise<boolean> {
    const addLikeSuccess = await this.db.addLike(liker, likee);
    if (!addLikeSuccess) throw new Error("Could not add like to likers table");
    return await this.db.checkMatchAndAdd(liker, likee);
  }
}

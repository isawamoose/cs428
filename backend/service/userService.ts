import { Database } from '../database/Database';

export class UserService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async login(username: string, password: string): Promise<boolean> {
    return await this.db.validateExistingUser(username, password);
  }
}

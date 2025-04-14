import mysql from "mysql2/promise";
import { config } from "../config";
import { tableCreateStatements } from "./dbModel";
import bcrypt from "bcrypt";
import { Profile } from "../../shared/Profile";
import { Message } from "../../shared/Message";
import { Conversation } from "../../shared/Conversation";

class Database {
  private initialized: Promise<void>;
  constructor() {
    this.initialized = this.initializeDatabase();
  }

  async getConnection(): Promise<mysql.Connection> {
    // Make sure the database is initialized before trying to get a connection.
    await this.initialized;
    return this._getConnection();
  }

  async executeQuery(
    operation: string,
    query: string,
    params: any[]
  ): Promise<any> {
    let result;
    const connection = await this.getConnection();
    try {
      result = await connection.query(query, params);
      return result as any;
    } catch (err: any) {
      console.error(`Error during ${operation}: ${err.message}`);
      return [];
    } finally {
      connection.end();
    }
  }

  async _getConnection(setUse = true): Promise<mysql.Connection> {
    const connection = await mysql.createConnection({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      connectTimeout: config.db.connectTimeout,
      decimalNumbers: true,
    });
    if (setUse) {
      await connection.query(`USE ${config.db.database}`);
    }
    return connection;
  }

  async initializeDatabase(): Promise<void> {
    try {
      const connection = await this._getConnection(false);
      try {
        await connection.query(
          `CREATE DATABASE IF NOT EXISTS ${config.db.database}`
        );
        await connection.query(`USE ${config.db.database}`);

        for (const statement of tableCreateStatements) {
          await connection.query(statement);
        }
      } finally {
        connection.end();
        console.log("Database initialized successfully");
      }
    } catch (err: any) {
      console.error(`Error initializing database: ${err.message}`);
    }
  }

  async addUserProfile(user: Profile) {
    // check that the email does not already exist
    let [rows] = await this.executeQuery(
      "check_user",
      "SELECT * FROM user WHERE email = ?",
      [user.email]
    );
    if (rows.length > 0) {
      return false;
    }

    [rows] = await this.executeQuery(
      "add_user_profile",
      "INSERT INTO user (email, dogName, breed, description, ownerName, imageLink) VALUES (?, ?, ?, ?, ?, ?)",
      [
        user.email,
        user.dogName,
        user.breed,
        user.description,
        user.ownerName,
        user.imageLink,
      ]
    );
    return rows && rows.affectedRows === 1;
  }

  async updateUserProfile(user: Profile) {
    const [rows] = await this.executeQuery(
      "update_user_profile",
      "UPDATE user SET dogName = ?, breed = ?, description = ?, ownerName = ?, imageLink = ? WHERE email = ?",
      [
        user.dogName,
        user.breed,
        user.description,
        user.ownerName,
        user.imageLink,
        user.email,
      ]
    );
    return rows && rows.affectedRows === 1;
  }

  async getUserProfile(email: string): Promise<Profile | null> {
    const [rows] = await this.executeQuery(
      "get_user_profile",
      "SELECT * FROM user WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return null;
    }
    const user = rows[0];
    return new Profile(
      user.email,
      user.dogName,
      user.breed,
      user.description,
      user.ownerName,
      user.imageLink
    );
  }

  async deleteUserProfile(email: string) {
    const [rows] = await this.executeQuery(
      "delete_user_profile",
      "DELETE FROM user WHERE email = ?",
      [email]
    );
    return rows && rows.affectedRows === 1;
  }

  async addUserAuth(email: string, password: string): Promise<boolean> {
    // check that the email does not already exist
    let [rows] = await this.executeQuery(
      "check_auth_user",
      "SELECT * FROM auth WHERE email = ?",
      [email]
    );
    if (rows.length > 0) {
      console.log("UserdogName already exists");
      return false;
    }
    const hash = await bcrypt.hash(password, 10);
    [rows] = await this.executeQuery(
      "add_auth_user",
      "INSERT INTO auth (email, password) VALUES (?, ?)",
      [email, hash]
    );
    return rows && rows.affectedRows === 1;
  }

  async validateUserAuth(email: String, password: string): Promise<boolean> {
    const [rows] = await this.executeQuery(
      "validate_user",
      "SELECT password FROM auth WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return false;
    }
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    return passwordMatch;
  }

  async deleteUserAuth(email: string) {
    const [rows] = await this.executeQuery(
      "delete_auth_user",
      "DELETE FROM auth WHERE email = ?",
      [email]
    );
    return rows && rows.affectedRows === 1;
  }

  async addToken(email: string, token: string) {
    // replace any existing token for this user
    await this.deleteToken(email);

    const [rows] = await this.executeQuery(
      "add_token",
      "INSERT INTO token (email, token) VALUES (?, ?)",
      [email, token]
    );
    return rows && rows.affectedRows === 1;
  }

  async getEmailFromToken(token: string): Promise<string | null> {
    const [rows] = await this.executeQuery(
      "get_email_by_token",
      "SELECT email FROM token WHERE token = ?",
      [token]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0].email;
  }

  async deleteToken(email: string) {
    const [rows] = await this.executeQuery(
      "delete_token",
      "DELETE FROM token WHERE email = ?",
      [email]
    );
    return rows && rows.affectedRows === 1;
  }

  // Match and vote tables
  // addLike adds a vote to the vote table and returns true if it results in a match
  // checkMatchAndAdd checks if the vote results in a match and adds it to the match table
  // addMatch adds a match to the match table

  // likeType: 1 for like, 0 for dislike
  async addLike(likerEmail: string, likeeEmail: string): Promise<boolean> {
    const [rows] = await this.executeQuery(
      "add_like",
      "INSERT INTO vote (likerEmail, likeeEmail, likeType) VALUES (?, ?, 1)",
      [likerEmail, likeeEmail]
    );
    return rows && rows.affectedRows === 1;
  }

  async addDislike(likerEmail: string, likeeEmail: string): Promise<boolean> {
    const [rows] = await this.executeQuery(
      "add_dislike",
      "INSERT INTO vote (likerEmail, likeeEmail, likeType) VALUES (?, ?, 0)",
      [likerEmail, likeeEmail]
    );
    return rows && rows.affectedRows === 1;
  }

  async addMatch(user1Email: string, user2Email: string): Promise<boolean> {
    const [rows] = await this.executeQuery(
      "add_match",
      "INSERT INTO dog_match (user1Email, user2Email) VALUES (?, ?)",
      [user1Email, user2Email]
    );
    const convo_created = await this.createConversation(user1Email, user2Email);
    if (!convo_created) {
      console.log("Error creating conversation between users");
      // throw new Error("Error creating conversation between users");
    }

    return rows && rows.affectedRows === 1;
  }

  async checkMatchAndAdd(
    likerEmail: string,
    likeeEmail: string
  ): Promise<boolean> {
    // Check if likee has already liked the liker
    // If so, add a match to the match table and return true
    // If not, return false
    const [rows] = await this.executeQuery(
      "check_match",
      "SELECT COUNT(*) as count FROM vote WHERE likerEmail = ? AND likeeEmail = ? AND likeType = 1",
      [likeeEmail, likerEmail]
    );
    const count = rows[0].count;
    if (count == 0) return false;
    else if (count > 0) {
      await this.addMatch(likerEmail, likeeEmail);
      return true;
    } else throw new Error("Error checking / adding match");
  }

  async getMatches(email: string): Promise<Profile[]> {
    const [rows] = await this.executeQuery(
      "get_matches",
      "SELECT user1Email, user2Email FROM dog_match WHERE user1Email = ? OR user2Email = ?",
      [email, email]
    );
    if (rows.length === 0) {
      return [];
    }
    try {
      const matches: Profile[] = await Promise.all(
        rows.map(async (row: any) => {
          const profile = await this.getUserProfile(
            row.user1Email === email ? row.user2Email : row.user1Email
          );
          return profile;
        })
      );
      return matches;
    } catch (error: any) {
      console.error(`Error getting matches: ${error.message}`);
      return [];
    }
  }

  // Messaging Endpoints
  async createConversation(
    user1Email: string,
    user2Email: string
  ): Promise<number> {
    const [emailA, emailB] =
      user1Email < user2Email
        ? [user1Email, user2Email]
        : [user2Email, user1Email];

    const [rows] = await this.executeQuery(
      "add_conversation",
      "INSERT INTO conversation (user1Email, user2Email) VALUES (?, ?)",
      [emailA, emailB]
    );
    if (rows && rows.affectedRows === 1) {
      return rows.insertId;
    }
    return -1;
  }

  async getConversationId(
    user1Email: string,
    user2Email: string
  ): Promise<number> {
    const [emailA, emailB] =
      user1Email < user2Email
        ? [user1Email, user2Email]
        : [user2Email, user1Email];
    const [rows] = await this.executeQuery(
      "get_conversation_id",
      "SELECT id from conversation WHERE user1Email = ? AND user2Email = ? OR user1Email = ? AND user2Email = ?",
      [emailA, emailB, emailB, emailA]
    );
    if (!rows || rows.length === 0) {
      // throw new Error("Users do not have an existing conversation yet");
      return await this.createConversation(user1Email, user2Email);
    }
    return rows[0].id;
  }

  async addMessage(message: Message): Promise<boolean> {
    const convoId: number = await this.getConversationId(
      message.senderEmail,
      message.recipientEmail
    );
    const [rows] = await this.executeQuery(
      "add_message",
      "INSERT INTO message (senderEmail, recipientEmail, conversationId, messageText, timestamp, isRead) VALUES (?, ?, ?, ?, ?, ?)",
      [
        message.senderEmail,
        message.recipientEmail,
        convoId,
        message.messageText,
        message.timestamp,
        true,
      ]
    );
    return rows && rows.affectedRows === 1;
  }

  async conversationExists(conversationId: number): Promise<boolean> {
    const [rows] = await this.executeQuery(
      "check_conversation_exists",
      "SELECT 1 FROM conversation WHERE id = ? LIMIT 1",
      [conversationId]
    );
    return rows.length > 0;
  }

  async getConversation(conversationId: number): Promise<Conversation> {
    const convoExists = await this.conversationExists(conversationId);
    if (!convoExists) {
      throw new Error(
        `Conversation does not exist with this id: ${conversationId}`
      );
    }
    const [rows] = await this.executeQuery(
      "get_conversation",
      "SELECT * FROM message WHERE conversationId = ?",
      [conversationId]
    );
    const conversation: Conversation = new Conversation(conversationId);
    const messages: Message[] = rows.map(
      (row: any) =>
        new Message(
          row.senderEmail,
          row.recipientEmail,
          row.messageText,
          row.timestamp
        )
    );
    conversation.setMessages(messages);

    return conversation;
  }

  async getUnvotedProfiles(email: string): Promise<Profile[]> {
    const [rows] = await this.executeQuery(
      "get_unliked_profiles",
      "SELECT * FROM user WHERE email != ? AND email NOT IN (SELECT likeeEmail FROM vote WHERE likerEmail = ?)",
      [email, email]
    );
    if (rows.length === 0) {
      return [];
    }
    try {
      return rows.map((row: any) => {
        return new Profile(
          row.email,
          row.dogName,
          row.breed,
          row.description,
          row.ownerName,
          row.imageLink
        );
      });
    } catch (error: any) {
      console.error(`Error getting unvoted profiles: ${error.message}`);
      return [];
    }
  }
}

const db = new Database();
export { db, Database };

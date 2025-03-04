import mysql from "mysql2/promise";
import { config } from "../config";
import { tableCreateStatements } from "./dbModel";
import bcrypt from "bcrypt";
import { Profile } from "@shared/Profile";

export class Database {
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
    // check that the username does not already exist
    let [rows] = await this.executeQuery(
      "check_user",
      "SELECT * FROM user WHERE username = ?",
      [user.username]
    );
    if (rows.length > 0) {
      return false;
    }

    [rows] = await this.executeQuery(
      "add_user_profile",
      "INSERT INTO user (username, name, breed, description, contact, ownerName, imageLink) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        user.username,
        user.name,
        user.breed,
        user.description,
        user.contact,
        user.ownerName,
        user.imageLink,
      ]
    );
    return rows && rows.affectedRows === 1;
  }

  async updateUserProfile(user: Profile) {
    const [rows] = await this.executeQuery(
      "update_user_profile",
      "UPDATE user SET name = ?, breed = ?, description = ?, contact = ?, ownerName = ?, imageLink = ? WHERE username = ?",
      [
        user.name,
        user.breed,
        user.description,
        user.contact,
        user.ownerName,
        user.imageLink,
        user.username,
      ]
    );
    return rows && rows.affectedRows === 1;
  }

  async getUserProfile(username: string): Promise<Profile | null> {
    const [rows] = await this.executeQuery(
      "get_user_profile",
      "SELECT * FROM user WHERE username = ?",
      [username]
    );
    if (rows.length === 0) {
      return null;
    }
    const user = rows[0];
    return new Profile(
      user.username,
      user.name,
      user.breed,
      user.description,
      user.contact,
      user.ownerName,
      user.imageLink
    );
  }

  async deleteUserProfile(username: string) {
    const [rows] = await this.executeQuery(
      "delete_user_profile",
      "DELETE FROM user WHERE username = ?",
      [username]
    );
    return rows && rows.affectedRows === 1;
  }

  async addUserAuth(username: string, password: string): Promise<boolean> {
    // check that the username does not already exist
    let [rows] = await this.executeQuery(
      "check_auth_user",
      "SELECT * FROM auth WHERE username = ?",
      [username]
    );
    if (rows.length > 0) {
      console.log("Username already exists");
      return false;
    }
    const hash = await bcrypt.hash(password, 10);
    [rows] = await this.executeQuery(
      "add_auth_user",
      "INSERT INTO auth (username, password) VALUES (?, ?)",
      [username, hash]
    );
    return rows && rows.affectedRows === 1;
  }

  async validateUserAuth(username: String, password: string): Promise<boolean> {
    const [rows] = await this.executeQuery(
      "validate_user",
      "SELECT password FROM auth WHERE username = ?",
      [username]
    );
    if (rows.length === 0) {
      return false;
    }
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    return passwordMatch;
  }

  async deleteUserAuth(username: string) {
    const [rows] = await this.executeQuery(
      "delete_auth_user",
      "DELETE FROM auth WHERE username = ?",
      [username]
    );
    return rows && rows.affectedRows === 1;
  }

  async addToken(username: string, token: string) {
    // replace any existing token for this user
    await this.deleteToken(username);

    const [rows] = await this.executeQuery(
      "add_token",
      "INSERT INTO token (username, token) VALUES (?, ?)",
      [username, token]
    );
    return rows && rows.affectedRows === 1;
  }

  async getUsernameFromToken(token: string): Promise<string | null> {
    const [rows] = await this.executeQuery(
      "get_username_by_token",
      "SELECT username FROM token WHERE token = ?",
      [token]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0].username;
  }

  async deleteToken(username: string) {
    const [rows] = await this.executeQuery(
      "delete_token",
      "DELETE FROM token WHERE username = ?",
      [username]
    );
    return rows && rows.affectedRows === 1;
  }
}

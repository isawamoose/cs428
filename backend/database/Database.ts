import mysql from "mysql2/promise";
import { config } from "../config";
import { tableCreateStatements } from "./dbModel";
import bcrypt from "bcrypt";
import { Profile } from "../shared/Profile";

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

  async deleteUserProfile(username: string) {
    const [rows] = await this.executeQuery(
      "delete_user_profile",
      "DELETE FROM user WHERE username = ?",
      [username]
    );
    return rows && rows.affectedRows === 1;
  }

  async addAuthUser(username: string, password: string): Promise<boolean> {
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

  async validateAuthUser(username: String, password: string): Promise<boolean> {
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

  async deleteAuthUser(username: string) {
    const [rows] = await this.executeQuery(
      "delete_auth_user",
      "DELETE FROM auth WHERE username = ?",
      [username]
    );
    return rows && rows.affectedRows === 1;
  }
}

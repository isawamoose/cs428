import mysql from 'mysql2/promise';
import { config } from '../config';
import { tableCreateStatements } from './dbModel';
import bcrypt from 'bcrypt';

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

  async executeQuery(operation: string, query: string, params: any[]): Promise<any> {
    let result;
    const connection = await this.getConnection();
    try {
      result = await connection.query(query, params);
      return result as any;
    } catch (err: any) {
      console.error(`Error during ${operation}: ${err.message}`);
      return false;
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
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.db.database}`);
        await connection.query(`USE ${config.db.database}`);

        for (const statement of tableCreateStatements) {
          await connection.query(statement);
        }
      } finally {
        connection.end();
        console.log('Database initialized successfully');
      }
    } catch (err: any) {
      console.error(`Error initializing database: ${err.message}`);
    }
  }

  async validateExistingUser(username: String, password: string): Promise<boolean> {
    const [rows] = await this.executeQuery('validate_user', 'SELECT password FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return false;
    }
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    return passwordMatch;
  }
}

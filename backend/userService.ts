import mysql from 'mysql2/promise';

export class UserService {
    private connection: mysql.Connection;

    constructor() {
        this.connection = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'whateverWeDecide',
        })
    }

    async validateExistingUser(username: String, password: string) {
        const [rows] = await this.connection.execute(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        return (rows as any[]).length > 0;
    }
}
export const tableCreateStatements = [
  `CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    breed VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    contact VARCHAR(255) NOT NULL,
    ownerName VARCHAR(255) NOT NULL,
    imageLink VARCHAR(255) NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS auth (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (username) REFERENCES user(username)
  )`,

  `CREATE TABLE IF NOT EXISTS token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    token VARCHAR(255) NOT NULL,
    FOREIGN KEY (username) REFERENCES user(username)
  )`,
];

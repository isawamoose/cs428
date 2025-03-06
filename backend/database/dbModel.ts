export const tableCreateStatements = [
  `CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    dogName VARCHAR(255) NOT NULL,
    breed VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    ownerName VARCHAR(255) NOT NULL,
    imageLink VARCHAR(255) NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS auth (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (email) REFERENCES user(email)
  )`,

  `CREATE TABLE IF NOT EXISTS token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    token VARCHAR(255) NOT NULL,
    FOREIGN KEY (email) REFERENCES user(email)
  )`,
];

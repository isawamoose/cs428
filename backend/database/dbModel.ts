export const tableCreateStatements = [
  `CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    breed VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    contact VARCHAR(255) NOT NULL,
    ownerName VARCHAR(255) NOT NULL,
    imageLink VARCHAR(255) NOT NULL
    )`,
];

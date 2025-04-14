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

  `CREATE TABLE IF NOT EXISTS vote(
    id INT AUTO_INCREMENT PRIMARY KEY,
    likerEmail VARCHAR(255) NOT NULL,
    likeeEmail VARCHAR(255) NOT NULL,
    likeType TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (likerEmail) REFERENCES user(email),
    FOREIGN KEY (likeeEmail) REFERENCES user(email),
    INDEX idx_likerEmail (likerEmail)
  )`,

  `CREATE TABLE IF NOT EXISTS dog_match(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1Email VARCHAR(255) NOT NULL,
    user2Email VARCHAR(255) NOT NULL,
    matchStatus TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (user1Email) REFERENCES user(email),
    FOREIGN KEY (user2Email) REFERENCES user(email),
    INDEX idx_user1Email (user1Email),
    INDEX idx_user2Email (user2Email)
  )`,

  `CREATE TABLE IF NOT EXISTS conversation(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1Email VARCHAR(255) NOT NULL,
    user2Email VARCHAR(255) NOT NULL,
    UNIQUE KEY unique_pair (user1Email, user2Email),
    FOREIGN KEY (user1Email) REFERENCES user(email),
    FOREIGN KEY (user2Email) REFERENCES user(email)
  )`,

  `CREATE TABLE IF NOT EXISTS message(
    id INT AUTO_INCREMENT PRIMARY KEY,
    senderEmail VARCHAR(255) NOT NULL,
    recipientEmail VARCHAR(255) NOT NULL,
    conversationId INT NOT NULL,
    messageText TEXT NOT NULL,
    timestamp VARCHAR(28) NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (senderEmail) REFERENCES user(email),
    FOREIGN KEY (conversationId) references conversation(id),
    INDEX idx_convo_time (conversationId, timestamp)
  )`,
];

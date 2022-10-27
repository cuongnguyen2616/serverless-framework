CREATE TABLE pocdb.contacts (
  id int AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,

);

INSERT INTO pocdb.contacts(email, firstname, lastname) VALUES
('testuser@gmail.com', 'test', 'user'),
('testuser2@gmail.com', 'test2', 'user2'),
('testuser3@gmail.com', 'test3', 'user3');
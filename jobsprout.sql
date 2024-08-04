-- Create admins table
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert data into admins table
INSERT INTO `admins` (id, username, password) VALUES
(1, 'admin', '$2b$10$cqptQ9KG4MY/oJ145/iewOsCW03JRUp2s4lKA2vCcX/B6H1bdK8Ze'),
(3, 'nilesh', '$2a$10$LRjmGj.Be3I/N4Mt5HcBa.3LYHRL2696cNafLeckNUuFfBhfQc29.'),
(6, 'nigam', '$2a$10$DbGMYTACLLrXduC.yRKvP.i0iXjhb8LAI0CW35pacD5OjTeayKlAG'),
(7, 'root', '$2a$10$FEqM7XIkMZcdnkvsx1O0..GNXn5nW8GPhKma6v2QpH9MPlIKRmRQK');

-- Create applications table
CREATE TABLE IF NOT EXISTS `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_id` (`job_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create jobs table
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert data into jobs table
INSERT INTO `jobs` (id, title, description, author) VALUES
(1, 'Software Engineer', 'Develop and maintain software applications', 'Google'),
(2, 'Software Engineer', 'Develop and maintain software applications', 'Facebook'),
(3, 'Data Analyst', 'IBM provide this', 'IBM'),
(5, 'Software Engineer', 'Develop and maintain software applications', 'Amazon'),
(6, 'System Analyst', 'Infosys', 'Infosys'),
(7, 'Data Analysis', 'Fresher Job For Data Analysis.', 'TCS');

-- Create users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `checkbox` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert data into users table
INSERT INTO `users` (id, username, password, checkbox) VALUES
(1, 'nigamsingh888@gmail.com', '$2b$10$mh1M2ZJAg/QwAQQ09vBTOODyqlf1r6ZMjqKZZmvQOnIEzEk.X1Rb6', 1),
(5, 'Nigam', '$2b$10$yQKJCGpS/z8GE0Y1yMqBX.9zO9wBDJmmrR75WaWoXuN9.M/g4COKq', 1);

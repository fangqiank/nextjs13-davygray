-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `authors` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`author` varchar(255) NOT NULL);

CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`category` varchar(255) NOT NULL);

CREATE TABLE `quotes` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`quote` varchar(255) NOT NULL,
	`author_id` int NOT NULL,
	`category_id` int NOT NULL);

CREATE UNIQUE INDEX `author` ON `authors` (`author`);
CREATE UNIQUE INDEX `category` ON `categories` (`category`);
CREATE UNIQUE INDEX `quote` ON `quotes` (`quote`);
CREATE INDEX `author_id_idx` ON `quotes` (`author_id`);
CREATE INDEX `category_id_idx` ON `quotes` (`category_id`);
*/
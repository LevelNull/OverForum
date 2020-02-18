CREATE DATABASE IF NOT EXISTS overforum_web;

USE overforum_web;



CREATE TABLE IF NOT EXISTS overforum_users(
    userid BINARY(16) DEFAULT (UUID_TO_BIN(UUID())) PRIMARY KEY,
    username VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL,
    password CHAR(60),
    joinedOn INT,
    lastSeenn INT,
    firstname VARCHAR(64),
    lastname VARCHAR(64),
    emailVerified BOOLEAN NOT NULL,
    enabled BOOLEAN NOT NULL
);

/* DELIMITER ;;
CREATE TRIGGER before_insert_users
BEFORE INSERT ON overforum_users
FOR EACH ROW
BEGIN
  IF new.userid IS NULL THEN
    SET new.userid = UUID_TO_BIN(UUID());
  END IF;
END
;; */

INSERT INTO overforum_users(username,firstname,email,emailVerified,enabled) VALUES (
    "administrator",
    "admin",
    "administrator@localhost",
    1,
    1
    );
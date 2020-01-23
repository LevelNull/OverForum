CREATE DATABASE IF NOT EXISTS overforum_web;

USE overforum_web;



CREATE TABLE IF NOT EXISTS users(
    userid BINARY(16) PRIMARY KEY ,
    username VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL,
    password VARCHAR(32),
    joinedOn INT,
    lastSeenn INT,
    firstname VARCHAR(64),
    lastname VARCHAR(64),
    emailVerified BOOLEAN NOT NULL,
    enabled BOOLEAN NOT NULL
);

DELIMITER ;;
CREATE TRIGGER before_insert_users
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
  IF new.userid IS NULL THEN
    SET new.userid = UUID_TO_BIN(UUID());
  END IF;
END
;;

INSERT INTO users(username,email,emailVerified,enabled) VALUES (
    "administrator",
    "administrator@localhost",
    1,
    1
    );
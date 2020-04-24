CREATE DATABASE IF NOT EXISTS overforum_web;

USE overforum_web;



CREATE TABLE IF NOT EXISTS overforum_users(
    userid CHAR(36) DEFAULT (UUID()) PRIMARY KEY,
    username VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL,
    password CHAR(60),
    joinedOn INT,
    lastSeen INT,
    firstname VARCHAR(64),
    lastname VARCHAR(64),
    emailVerified BOOLEAN DEFAULT false,
    userMode INT(2) NOT NULL,
    UNIQUE KEY (username,email)
);


INSERT INTO overforum_users(username,firstname,email,emailVerified,userMode) VALUES (
    "administrator",
    "admin",
    "administrator@localhost",
    0,
    0
    );
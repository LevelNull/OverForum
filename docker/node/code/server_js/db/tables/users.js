var config = require("../../../config/settings");
module.exports ={
    createTable:
        "CREATE TABLE IF NOT EXISTS "+config.mysqlOptions.prefix+"users("+
            "userid BINARY(16) DEFAULT (UUID_TO_BIN(UUID())) PRIMARY KEY, "+
            "username VARCHAR(64) NOT NULL,"+
            "email VARCHAR(128) NOT NULL,"+
            "password CHAR(60),"+
            "joinedOn INT,"+
            "lastSeenn INT,"+
            "firstname VARCHAR(64),"+
            "lastname VARCHAR(64),"+
            "emailVerified BOOLEAN NOT NULL, "+
            "enabled BOOLEAN NOT NULL, "+
            "UNIQUE KEY (username,email)"+
            ")",
    getUserListLimited:
        "SELECT username,firstname,lastname "+
        "FROM "+config.mysqlOptions.prefix+"users "+
        "LIMIT ?, 50",
    getUserByEmail:
        "SELECT "+
        "BIN_TO_UUID(userid) as uuid,"+
        "userid as uuidBin,"+
        "email,"+
        "username,"+
        "password,"+
        "firstname,"+
        "lastname,"+
        "emailVerified,"+
        "enabled "+
        "FROM "+config.mysqlOptions.prefix+"users WHERE email=? LIMIT 1",

    setUserPassword:
        "UPDATE "+config.mysqlOptions.prefix+"users SET password=? WHERE BIN_TO_UUID(userid)=?"
}


var config = require("../../../config/settings");
module.exports ={
    createTable:
        "CREATE TABLE IF NOT EXISTS "+config.mysqlOptions.prefix+"users("+
            "userid CHAR(36) DEFAULT (UUID()) PRIMARY KEY, "+
            "username VARCHAR(64) NOT NULL,"+
            "email VARCHAR(128) NOT NULL,"+
            "password CHAR(60),"+
            "joinedOn INT,"+
            "lastSeen INT,"+
            "firstname VARCHAR(64),"+
            "lastname VARCHAR(64),"+
            "emailVerified BOOLEAN DEFAULT false, "+
            "userMode INT(2) NOT NULL, "+
            "UNIQUE KEY (username,email)"+
            ")",
    getUserListLimited:
        "SELECT userid,email,username,firstname,lastname,userMode "+
        "FROM "+config.mysqlOptions.prefix+"users "+
        "LIMIT ?, 50",
    getUserByEmail:
        "SELECT "+
        "userid as uuid,"+
        "userid as uuidBin,"+
        "email,"+
        "username,"+
        "password,"+
        "firstname,"+
        "lastname,"+
        "emailVerified,"+
        "userMode "+
        "FROM "+config.mysqlOptions.prefix+"users WHERE email=? LIMIT 1",
    getUserByUUID:
        "SELECT * FROM "+config.mysqlOptions.prefix+"users WHERE userid=? LIMIT 1",
    setUserPassword:
        "UPDATE "+config.mysqlOptions.prefix+"users SET password=? WHERE userid=?",
    addUser:
        "INSERT INTO "+config.mysqlOptions.prefix+"users("+
        "username,email,password,firstname,lastname,joinedOn,lastSeen,userMode ) "+
        "VALUES(?,?,?,?,?,?,?,?)"
}
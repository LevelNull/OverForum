var config = require("../../../config/settings");
module.exports = {
    createTable:
        "CREATE TABLE IF NOT EXISTS "+config.mysqlOptions.prefix+"groups("+
        "groupID BINARY(16) DEFAULT (UUID_TO_BIN(UUID())) PRIMARY KEY, "+
        "groupName VARCHAR(24) NOT NULL,"+
        "enabled BOOL,"+
        "UNIQUE KEY (groupName))",
    addGroup:
        "INSERT INTO "+config.mysqlOptions.prefix+"groups"+
        "(groupName,enabled) VALUES"+
        "(?,true)",
    setDefaults:
        "INSERT INTO "+config.mysqlOptions.prefix+"groups"+
        "(groupName,enabled) VALUES"+
        "('administrators',true), "+
        "('moderators',true), "+
        "('users',true)",
    getAll:
        "SELECT * FROM "+config.mysqlOptions.prefix+"groups"
}
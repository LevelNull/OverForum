var config = require("../../../config/settings");
module.exports = {
    createTable:
        "CREATE TABLE IF NOT EXISTS "+config.mysqlOptions.prefix+"permissions("+
        "node VARCHAR(32) PRIMARY KEY, "+
        "name VARCHAR(64),"+
        "permID BINARY(16) DEFAULT (UUID_TO_BIN(UUID())))",
    getAll:
    "SELECT * FROM "+config.mysqlOptions.prefix+"permissions",
    setDefaults:
        "INSERT INTO "+config.mysqlOptions.prefix+"permissions(node, name)"+
        " VALUES"+
        "('server.listeners.restart','Restart Server Listeners'), "+
        "('pages.adminpanel.view','View Admin Panel')"
}
var config = require("../../../config/settings");
module.exports = {
    createTable:
        "CREATE TABLE IF NOT EXISTS "+config.mysqlOptions.prefix+"permmap("+
        "id INT AUTO_INCREMENT PRIMARY KEY,"+
        "target BINARY(16) NOT NULL,"+
        "permID BINARY(16) NOT NULL"+
        ")",
    getAll:
        "SELECT * FROM "+config.mysqlOptions.prefix+"permmap",
    getEntry:
        "SELECT * FROM "+config.mysqlOptions.prefix+"permmap "+
        "WHERE target=?",
    setDefaults:
        "INSERT INTO "+config.mysqlOptions.prefix+"permmap(target,permID) VALUES "+
        "((SELECT groupID FROM "+config.mysqlOptions.prefix+"groups WHERE groupName='administrators'), "+
        "(SELECT permID FROM "+config.mysqlOptions.prefix+"permissions WHERE node='server.listeners.restart')), "+
        //
        "((SELECT groupID FROM "+config.mysqlOptions.prefix+"groups WHERE groupName='administrators'), "+
        "(SELECT permID FROM "+config.mysqlOptions.prefix+"permissions WHERE node='pages.adminpanel.view'))"
}
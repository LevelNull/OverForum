var config = require("../../../config/settings");
module.exports = {
    createTable:
        "CREATE TABLE IF NOT EXISTS "+config.mysqlOptions.prefix+"permmap("+
        "id INT AUTO_INCREMENT PRIMARY KEY,"+
        "target CHAR(36) NOT NULL,"+
        "node VARCHAR(32) NOT NULL"+
        ")",
    getAll:
        "SELECT * FROM "+config.mysqlOptions.prefix+"permmap",
    getTarget:
        "SELECT * FROM "+config.mysqlOptions.prefix+"permmap "+
        "WHERE target=?",
    setDefaults:
        "INSERT INTO "+config.mysqlOptions.prefix+"permmap(target,node) VALUES "+
        "((SELECT groupID FROM "+config.mysqlOptions.prefix+"groups WHERE groupName='administrators'), "+
        "'server.listeners.restart'), "+
        //
        "((SELECT groupID FROM "+config.mysqlOptions.prefix+"groups WHERE groupName='administrators'), "+
        "'server.users.list'), "+
        //
        "((SELECT groupID FROM "+config.mysqlOptions.prefix+"groups WHERE groupName='administrators'), "+
        "'server.groups.list'), "+
        //
        "((SELECT groupID FROM "+config.mysqlOptions.prefix+"groups WHERE groupName='administrators'), "+
        "'server.permissions.list'), "+
        //
        "((SELECT groupID FROM "+config.mysqlOptions.prefix+"groups WHERE groupName='administrators'), "+
        "'server.users.add'), "+
        //
        "((SELECT groupID FROM "+config.mysqlOptions.prefix+"groups WHERE groupName='users'), "+
        "'pages.forum.view'), "+
        //
        "((SELECT groupID FROM "+config.mysqlOptions.prefix+"groups WHERE groupName='administrators'), "+
        "'server.users.details.others'), "+
        //
        "((SELECT groupID FROM "+config.mysqlOptions.prefix+"groups WHERE groupName='administrators'), "+
        "'pages.adminpanel.view')"
}
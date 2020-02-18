var config = require("../../../config/settings");
module.exports = {
    createTable:
        "CREATE TABLE IF NOT EXISTS "+config.mysqlOptions.prefix+"groupmap("+
        "target BINARY(16) NOT NULL,"+
        "inherit BINARY(16) NOT NULL"+
        ")",
    getEntry:
        "SELECT * FROM "+config.mysqlOptions.prefix+"groupmap "+
        "WHERE target=?",
    setDefaults:
        "INSERT INTO "+config.mysqlOptions.prefix+"groupmap VALUES"+
        "((SELECT userid FROM "+config.mysqlOptions.prefix+"users WHERE username=\'administrator\'), "+
        "(SELECT groupID FROM "+config.mysqlOptions.prefix+"groups WHERE groupName=\'administrators\')),"+
        //
        "((SELECT groupID FROM "+config.mysqlOptions.prefix+"groups WHERE groupName=\"administrators\"),"+
        "(SELECT groupID FROM "+config.mysqlOptions.prefix+"groups WHERE groupName=\"moderators\")),"+
        //
        "((SELECT groupID FROM "+config.mysqlOptions.prefix+"groups WHERE groupName=\'moderators\'), "+
        "(SELECT groupID FROM "+config.mysqlOptions.prefix+"groups WHERE groupName=\'users\'))"
}
var config = require("../../../config/settings");
module.exports = {
    createTable:
        "CREATE TABLE IF NOT EXISTS "+config.mysqlOptions.prefix+"permissions("+
        "node VARCHAR(32) PRIMARY KEY, "+
        "name VARCHAR(64))",
    getAll:
    "SELECT * FROM "+config.mysqlOptions.prefix+"permissions",
    setDefaults:
        "INSERT INTO "+config.mysqlOptions.prefix+"permissions(node, name)"+
        " VALUES"+
        "('server.listeners.restart','Restart server listeners'), "+
        "('pages.adminpanel.view','View admin panel'),"+
        "('server.users.list','Allow listing of users'),"+
        "('server.users.details.others','Allow viewing details of other users'),"+
        "('server.permissions.list','List available permissions'),"+
        "('server.groups.list','Allow listing of groups'),"+
        "('server.groups.details','Allow viewing of group details'),"+
        "('server.users.add','Allow adding of users'),"+
        "('server.groups.modify','Allow modification of groups')"
}
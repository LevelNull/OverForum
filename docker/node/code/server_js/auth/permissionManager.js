var _mysql = require("mysql");
var config = require("./../../config/settings");
var permMap = require("./../db/tables/permmap");
var groupMap = require("./../db/tables/groupmap");
var permTable = require("./../db/tables/permissions");
var groupTable = require("./../db/tables/groups");
permissions = {};
groups = {};

function _construct(){
    var mysql  = _mysql.createConnection(config.mysqlOptions);
    
    mysql.query(groupTable.getAll,function(err,res,field){
        if(err != null){
            return;
        }
        res.forEach(group =>{
            groups[group.groupID] = {
                name: group.groupName,
                enabled: group.enabled,
                inherit: [],
                permissions: []
            }
            mysql.query(groupMap.getEntry,[group.groupID],function(err,res,field){
                if(err != null)return;
                res.forEach(inheritance =>{
                    groups[group.groupID].inherit.push(inheritance.inherit);
                });
            });
            mysql.query(permTable.getAll,function(err,res,field){
                if(err != null)return;
                res.forEach(perm =>{
                    permissions[perm.node] = {permID: perm.permID, name: perm.name};
                });
            });
            mysql.query(permMap.getEntry,[group.groupID],function(err,res,field){
                if(err != null){
                    return;
                }
                var groupPerms = [];
                res.forEach(item => {
                    groups[group.groupID].permissions.push(item.permID);
                });
            });
        });
    });
}
function applySessionPermissions(req){
    var mysql  = _mysql.createConnection(config.mysqlOptions);
    mysql.query(groupMap.getEntry,[req.session.user.uuidBin],function(err,res,field){
        if(err != null)return console.log(err);
        req.session.user.groups = [];
        res.forEach(item =>{
            req.session.user.groups.push(groups[item.inherit]);
        });
        req.session.save();
    });
    mysql.query(permMap.getEntry,[req.session.user.uuidBin],function(err,res,field){
        if(err != null)return console.log(err);
        req.session.user.permissions = [];
        res.forEach(item => {
            req.session.user.permissions.push(item.permID);
        });
        req.session.save();
    });
}
function dump(){
    console.log(Object.keys(groups).length);
    console.log(groups);
    console.log(permissions);
}

function isAllowed(req,required){
    return new Promise((resolve, reject)=>{
        if(req.session.user){
            if(req.session.user.permissions != undefined){
                if(req.session.user.permissions.some(e => Buffer.from(e.data).equals(required))){
                    resolve();
                }else{
                    if(req.session.user.groups != undefined){
                        req.session.user.groups.forEach(group =>{
                            if(group.permissions != undefined){
                                if(group.permissions.some(e => Buffer.from(e.data).equals(required))){
                                    resolve();
                                }
                            }
                        });
                    }else{
                        reject();
                    }
                }
            }else{
                reject();
            }
        }else{
            reject();
        }
    });
}
function convertNode(node){
    return permissions[node].permID;
}
module.exports = {
    _construct:                 _construct,
    dump:                       dump,
    groups:                     this.groups,
    applySessionPermissions:    applySessionPermissions,
    isAllowed:                  isAllowed,
    convertNode:                convertNode
}
_construct();
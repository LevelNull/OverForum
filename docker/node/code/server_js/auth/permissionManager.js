var config = require("./../../config/settings");
var permMap = require("./../db/tables/permmap");
var groupMap = require("./../db/tables/groupmap");
var permTable = require("./../db/tables/permissions");
var groupTable = require("./../db/tables/groups");
var _mysql = require("mysql");
var mysql = _mysql.createPool(config.mysqlOptions);
permissions = {};
groups = {};

function _construct(){
    var _permissions = {};
    var _groups = {};
    try{
        mysql.query(permTable.getAll,async function(err,res,field){
            if(err != null){
                await errorHandler(err).then(retry=> {applySessionPermissions(req);}).catch(fail => {return;});
            }else{
                res.forEach(perm =>{
                    _permissions[perm.node] = perm.name;
                });
                permissions = _permissions;
            }
        });
        mysql.query(groupTable.getAll,async function(err,res,field){
            if(err != null){
                await errorHandler(err).then(retry=> {applySessionPermissions(req);}).catch(fail => {return;});
            }else{
                res.forEach(group =>{
                    _groups[group.groupID] = {
                        name: group.groupName,
                        enabled: group.enabled,
                        inherit: [],
                        permissions: {}
                    }
                    mysql.query(groupMap.getEntry,[group.groupID],async function(err,res,field){
                        if(err != null){
                            await errorHandler(err).then(retry=> {applySessionPermissions(req);}).catch(fail => {return;});
                        }else{
                            res.forEach(inheritance =>{
                                _groups[group.groupID].inherit.push(inheritance.inherit);
                            });
                        }
                    });
                    mysql.query(permMap.getTarget,[group.groupID],async function(err,res,field){
                        if(err != null){
                            await errorHandler(err).then(retry=> {applySessionPermissions(req);}).catch(fail => {return;});
                        }else{
                            //console.log(res);
                            res.forEach(item => {
                                //console.log(item.node);
                                _groups[group.groupID].permissions[item.node] = true;
                                //groups[group.groupID].permissions.push(item.permID);
                            });
                        }
                    });
                });
                groups = _groups;
            }
        });
    }catch(err){
        console.log(err.code);
    }
}
function applySessionPermissions(req){
    req.session.user.permissions = {};
    req.session.user.cache = {size: 0};
    req.session.user.groups = [];
    mysql.query(groupMap.getEntry,[req.session.user.uuidBin],function(err,res,field){
        if(err != null){
            errorHandler(err).then(retry=> {applySessionPermissions(req);}).catch(fail => {return;});
        }else{
            res.forEach(item =>{
                req.session.user.groups.push(groups[item.inherit]);
                req.session.save();
            });
        }
    });
    mysql.query(permMap.getTarget,[req.session.user.uuidBin],function(err,res,field){
        if(err != null){
            errorHandler(err).then(retry=> {applySessionPermissions(req);}).catch(fail => {return;});
        }else{
            res.forEach(item => {
                req.session.user.permissions[item.node] = true;
                req.session.save();
            });
        }
    });
    req.session.save();
}
function dump(){
    console.log(Object.keys(groups).length);
    console.log(groups);
    console.log(permissions);
}
function errorHandler(err){
    return new Promise((resolve,reject)=>{
        if(err.code == "PROTOCOL_ENQUEUE_AFTER_QUIT"){
            console.log("Restart mysql connection...");
            mysql = _mysql.createConnection(config.mysqlOptions);
            resolve();
        }else if(err.code == "ER_NO_SUCH_TABLE"){
            console.error(err.sqlMessage);
            reject();
        }else{
            console.error(err);
            throw new Error("There has been an Error in PermissionManager!");
            reject();
        }
    });
    
}
function isAllowed(req,required){
    //console.log(req.session.user);
    return new Promise((resolve, reject)=>{
        if(req.session.user){
            if(req.session.user.cache){
                if(req.session.user.cache[required]){
                    //console.log("Found in cache.");
                    resolve();
                }else{
                    if(req.session.user.permissions){
                        if(req.session.user.permissions[required]){
                            //console.log("found!");
                            addCacheItem(req,required);
                            resolve();
                        }else{
                            if(req.session.user.groups){
                                req.session.user.groups.forEach(group =>{
                                    if(group.permissions != undefined){
                                        if(group.permissions[required]){
                                            //console.log("found!");
                                            addCacheItem(req,required);
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
                }
            }else{
                reject();
            }
        }else{
            reject();
        }
    });
}

function addCacheItem(req,node){
    if(req.session.user.cache){
        var cache = req.session.user.cache;
        if(cache[node])return;
        if(cache.size < 25){
            cache[node] = true;
            cache.size++;
            req.session.save();
            console.log(cache);
        }else{
            cache[node] = true;
            var todel = Object.keys(cache)[0];
            delete cache[todel];
            req.session.save();
            console.log(cache);
        }
    }
}
function reload(){
    _construct();
}
module.exports = {
    dump:                       dump,
    groups:                     this.groups,
    applySessionPermissions:    applySessionPermissions,
    isAllowed:                  isAllowed,
    reload:                     reload
}
_construct();
//setTimeout(dump,5000);
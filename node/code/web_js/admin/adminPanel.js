var sidebardata = {};
var contextMenu = "";
var navbuttons = {
    users: document.getElementById("usersoption"),
    groups: document.getElementById("groupsoption"),
    permissions: document.getElementById("permissionsoption")
};
var loadScript = function(url, code, parent){
    var scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.onload = code;
    scriptTag.onreadystatechange = code;
    parent.appendChild(scriptTag);
};
var listtype = {
    "Groups List":              0,
    "User List":                1,
    "Available Permissions":    2
}
var currentHeaders = {};

async function updateSelectionList(result,header,filter=undefined){
    ht = "";
    var head = document.getElementById("infotablehead");
    var pane = document.getElementById("infotable");
    var headlist = document.getElementById("listHeader");
    if(header){
        head.innerText = header;
        document.getElementById("listtype").value = listtype[header];
    }
    if(result){
        if(result.success){
            contextMenu = result.menu;
            currentHeaders = result.headers;
            sidebardata = result.data;
            for(var i =0;i < Object.keys(result.headers).length;i++){
                ht += "<td><a>"+result.headers[i]+"</a></td>";
            }
            headlist.innerHTML = ht;
            ht = "";
            for(var item in result.data){
                ht += "<tr id="+item+" >";
                for(var i =0;i < Object.keys(result.headers).length;i++){
                    ht += "<td><a>"+result.data[item][result.headers[i]]+"</a></td>"
                }
                ht += "</tr>";
            }
            pane.innerHTML = ht;
            addEventListners(header);
        }
    }else{
        if(filter != undefined){
            for(var item in filter){
                ht += "<tr id="+filter[item]+" >";
                for(var i =0;i < Object.keys(currentHeaders).length;i++){
                    ht += "<td><a>"+sidebardata[filter[item]][currentHeaders[i]]+"</a></td>"
                }
                ht += "</tr>";
            }
            pane.innerHTML = ht;
        }
    }
}
function openContextMenu(event){
    var elem = getSender(event);
    var menu = document.getElementById("contextMenu");
    menu.innerHTML = contextMenu+"<input type=hidden value="+elem.id+"</input>";
    menu.style.left = event.pageX+"px";
    menu.style.top = event.pageY+"px";
    menu.style.width = "auto";
    menu.style.height = "auto";
}
function closeContextMenu(){
    var menu = document.getElementById("contextMenu");
    menu.style.width = 0;
    menu.style.height = 0;
    menu.style.left = "-500px";
    menu.style.top = "-500px";
}
function addEventListners(type){
    for(item in sidebardata){
        document.getElementById(item).addEventListener("click",getDetails);
        document.getElementById(item).addEventListener("contextmenu",getQuickActions);
    }
}
function getQuickActions(event){
    openContextMenu(event);
    return false;
}
function getSender(event,find="TR"){
    var sender = event.target;
    var type = document.getElementById("listtype").value;
    while( sender != null && sender != undefined && sender.tagName != find){
        sender = sender.parentElement;
    }
    return sender;
}
function getDetails(event){
    var elem = getSender(event);
    //alert(elem.id);
    requestHTML("panel/userDetails",{requestedUser: elem.id},"POST");
    requestJS("panel/userDetails.js");
}
function queryServer(url,header){
    $.ajax({
        type:       "POST",
        contentType:"application/json",
        dataType:   "json",
        url:        window.location+"/"+url,
        success:    function(data){
            updateSelectionList(data,header);
        }
    });
}
function getUsersList(){
    queryServer("users","User List");
}
function getGroupsList(){
    queryServer("groups","Groups List");
}
function getPermissionsList(){
    queryServer("permissions","Available Permissions");
}
function filterList(){
    var input = document.getElementById("selectionSearch");
    var reg = new RegExp(input.value.toLowerCase());
    var a = Object.keys(sidebardata).filter(item => new RegExp(input.value.toLowerCase()).test(item));
    var b = Object.keys(sidebardata).filter(item => 
        Object.values(sidebardata[item]).find(entry => {
            if(entry != null && typeof(entry) === 'string'){
                return reg.test(entry.toLowerCase());
            }else{
                return reg.test(entry);
            }
        }));
    var filtered = Object.assign({},a,b);
    updateSelectionList(false,undefined,filtered);
}
function requestHTML(file,params={},method="GET"){
    console.log(Object.values(params));
    $.ajax({
        type:       method,
        url:        file,
        data:       params,
        success:    function(data){
            document.getElementById("extraContent").innerHTML = data;
        }
    });
}
function requestJS(file){
    var parent = document.getElementById("extraContent");
    var newjs = document.createElement("script");
    newjs.type = "application/javascript";
    newjs.src = file;
    parent.append(newjs);
}
window.onload = getUsersList;

////////////

////////////
document.getElementById("optionsList").addEventListener("change",function(){
    switch(document.getElementById("optionsList").value){
        case "users":       getUsersList();break;
        case "groups":      getGroupsList();break;
        case "permissions": getPermissionsList();break;
        default:            getUsersList();break;
    }
});
document.getElementById("selectionSearch").oninput = filterList;
$("#selectionSearch").on('keyup',function(e){
    if(e.keyCode === 13){
        filterList();
    }
});
document.getElementById("addUserButton").addEventListener("click",function(){
    requestHTML("panel/addUser");
    requestJS("panel/addUser.js");
    requestJS("/auth/registerPage.js")
});
document.oncontextmenu = function(event) {
    var sender = getSender(event);
    if(sender == null){
        closeContextMenu();
        return true;
    }else{
        return false;
    }
    
}
document.documentElement.addEventListener("click",function(event){
    var menu = document.getElementById("contextMenu");
    var sender = getSender(event,"P");
    if(sender == null || sender.id != "contextMenu"){
        if(menu.style.height != 0){
            closeContextMenu();
        }
    }
});
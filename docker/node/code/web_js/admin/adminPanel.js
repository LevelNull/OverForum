var sidebardata = {};
var navbuttons = {
    users: document.getElementById("usersoption"),
    groups: document.getElementById("groupsoption"),
    permissions: document.getElementById("permissionsoption")
};
var listtype = {
    "Groups List":              0,
    "User List":                1,
    "Available Permissions":    2
}
async function updateSelectionList(data,header,filter=undefined){
    ht = "";
    var head = document.getElementById("infotablehead");
    var pane = document.getElementById("infotable");
    if(header){
        head.innerText = header;
        document.getElementById("listtype").value = listtype[header];
    }
    if(data){
        if(data.success){
            sidebardata = data.data;
            for(var item in data.data){
                ht += "<tr id="+item+" ><td><div><h3>"+item+"</h3>";
                for(obj in data.data[item]){
                    ht += "<a>"+obj+""+data.data[item][obj]+"</a>"
                }
                ht += "</div></td></tr>";
            }
            pane.innerHTML = ht;
            addEventListners(header);
        }
    }else{
        if(filter != undefined){
            for(var item in filter){
                ht += "<tr id="+filter[item]+" ><td><div><h3>"+filter[item]+"</h3>";
                for(obj in sidebardata[filter[item]]){
                    ht += "<a>"+obj+""+sidebardata[filter[item]][obj]+"</a>"
                }
                ht += "</div></td></tr>";
            }
            pane.innerHTML = ht;
        }
    }
}
function addEventListners(type){
    for(item in sidebardata){
        document.getElementById(item).addEventListener("click",getDetails);
    }
}
function getDetails(event){
    var sender = event.target;
    var type = document.getElementById("listtype").value;
    while(sender.tagName != "TR"){
        sender = sender.parentElement;
    }
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
    selectNavItem("users");
}
function getGroupsList(){
    queryServer("groups","Groups List");
    selectNavItem("groups");
}
function getPermissionsList(){
    queryServer("permissions","Available Permissions");
    selectNavItem("permissions");
}
function selectNavItem(item){
    var toset = navbuttons[item];
    for(option in navbuttons){
        navbuttons[option].classList.remove("header-blue");
    }
    toset.classList.add("header-blue");
}
function filterList(){
    var input = document.getElementById("selectionSearch");
    var filtered = Object.keys(sidebardata).filter(item => new RegExp(input.value).test(item));
    updateSelectionList(false,undefined,filtered);
}

window.onload = getGroupsList;
document.getElementById("usersoption").addEventListener("click",getUsersList);
document.getElementById("groupsoption").addEventListener("click",getGroupsList);
document.getElementById("permissionsoption").addEventListener("click",getPermissionsList);
document.getElementById("selectionSearch").oninput = filterList;
$("#selectionSearch").on('keyup',function(e){
    if(e.keyCode === 13){
        queryFiltered();
    }
});
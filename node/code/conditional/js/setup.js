function noSpecial(str){
    var regex = /^[A-Za-z0-9 ]+$/
        return regex.test(str);
}
function containsNumeral(str){
    return /\d/.test(str);
}
function setText(field,textField,text,sw){
    textField.innerText = text;
    if(sw == 0){
        field.classList.remove("bad");
        field.classList.remove("warn");
        field.classList.add("good");
    }else if(sw == 1){
        field.classList.remove("good");
        field.classList.remove("bad");
        field.classList.add("warn");
    }else{
        field.classList.remove("good");
        field.classList.remove("warn");
        field.classList.add("bad");
    }
}
function checkPasswordMatch(){
    var password = document.querySelector("#password");
    var field = document.querySelector("#passwordconfirm");
    var text = document.getElementById("errorText");
    if(field.value.length > 0){
        if(field.value === password.value){
            setText(field,text,"",0);
            return true;
        }else{
            setText(field,text,"Passwords don't match!",2);
            return false;
        }
    }else{
        return false;
    }
}
function checkPassword(){
    var password = document.querySelector("#password");
    var text = document.getElementById("errorText");
    var warn = document.getElementById("warnText");
    var match = checkPasswordMatch();
    if(password.value.length < 8){
        setText(password,text,"Password must be at least 8 characters!");
        return false;
    }else{
        if(!noSpecial(password.value)){
            if(containsNumeral(password.value)){
                setText(password,text,"",0);
                setText(password,warn,"",0);
                return match && true;
            }else{
                setText(password,text,"",0);
                setText(password,warn,"Warn: Password contains no numbers",1);
                return match && true;
            }
        }else{
            setText(password,text,"",0);
            setText(password,warn,"Warn: Password contains no special characters",1);
            return  match && true;
        }
        
    }
}
function testMysql(){
    var options = {
        options:{
        host: document.getElementById("mysqlHost").value,
        user: document.getElementById("mysqlUser").value,
        password: document.getElementById("mysqlPassword").value,
        database: document.getElementById("mysqlDatabase").value,
        prefix: document.getElementById("tablePrefix").value
        }
    }
    document.getElementById("mysqlWarn").innerText = "Attempting connection...";
    $.ajax({
       type: "POST",
       url: window.location+"/mysqlTest",
       data: JSON.stringify(options),
       contentType: "application/json",
       dataType: "json",
       success: function(result){
           document.getElementById("mysqlWarn").innerText = "";
           document.getElementById("mysqlError").innerText = "";
           document.getElementById("mysqlGood").innerText = "";
           if(result.success){
            document.getElementById("mysqlGood").innerText = result.message;
           }else{
            document.getElementById("mysqlError").innerText = result.message;
           }
       }
    });
}
function submit(){
    if(checkPassword()){
        //alert("Submit");
        var mysql = {
            host: document.getElementById("mysqlHost").value,
            user: document.getElementById("mysqlUser").value,
            password: document.getElementById("mysqlPassword").value,
            database: document.getElementById("mysqlDatabase").value,
            prefix: document.getElementById("tablePrefix").value
        }
        var cred = {
            credentials: {
            password: document.getElementById("password").value,
            confirmpassword: document.getElementById("passwordconfirm").value,
            iknowwhatimdoing: true
            },
            options: mysql
        }
        $.ajax({
            type: "POST",
            url: window.location+"/preSetup",
            data: JSON.stringify(cred),
            contentType: "application/json",
            dataType: "json",
            success: runSetup
        });
    }else{
    }
}
function runSetup(result){
    if(result.success){
        document.getElementById("adminSetup").innerHTML = ""+
                "<div id=stepList class=stepList ></div>"+
                "<button id=doneButton class=button >Next</button>";
        for(var step in result.todo){
            document.getElementById("stepList").innerHTML += ""+
                "<div id="+result.todo[step].url+" class=stepListItem >"+
                "<a class=warnText >waiting...</a>"+
                "<a class=goodText ></a>"+
                "<a class=errorText ></a>"+
                "<h3>"+result.todo[step].title+"</h3>"+
                "</div>";
        }
        document.getElementById("doneButton").addEventListener("click",function(){
            window.location.replace("/login");
        });
        runSteps(result.todo);
    }else{
        document.getElementById("errorText").innerText = result.message;
    }
}
function runSteps(list,ind=0){
    if(Object.keys(list).length <= ind){
        return;
    }else{
        var item = Object.values(list)[ind];
        //alert(item.url);
        $.ajax({
            type: "POST",
            url: window.location+"/"+item.url,
            data: "{\"message\":\"none\"}",
            contentType: "application/json",
            dataType: "json",
            statusCode: {
                200: function(result){
                    setResultText(result,item);
                    if(result.success)runSteps(list,ind+1);
                },
                404: function(){
                    var res = {
                        "success":false,
                        "message":""
                    }
                    setResultText(res,item);
                }
            } 
        });
    }
}
function setResultText(result,item){
    var statuses = document.querySelector("#"+item.url).getElementsByTagName("a");
        for(i = 0;i<statuses.length; i++){
            var element = statuses[i];
            element.innerText = "";
        }
    if(result.success){
        
        var text = document.querySelector("#"+item.url).getElementsByClassName("goodText")[0];
        text.innerText = "Successful";
    }else{
        var text = document.querySelector("#"+item.url).getElementsByClassName("errorText")[0];
        text.innerText = "Failed";
    }
}
document.getElementById("passwordconfirm").onchange = checkPassword;
document.getElementById("password").onchange = checkPassword;
document.getElementById("doneButton").addEventListener("click", submit);
document.getElementById("testMysql").addEventListener("click", testMysql);
$("#password").on('keyup',function(e){
    if(e.keyCode === 13){
        document.getElementById("passwordconfirm").focus();
    }
});
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
    var text = document.getElementById("credentialError");
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
    var text = document.getElementById("credentialError");
    var warn = document.getElementById("credentialWarn");
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
function submit(){
    if(checkPassword()){
        //alert("Submit");
        var payload = {
            "newpassword": document.getElementById("passwordconfirm").value,
            "iknowwhatimdoing": false
        }
        $.ajax({
            type: "POST",
            url: "/setup/acs",
            data: JSON.stringify(payload),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                if(data.success){
                    document.getElementById("errorText").innerText = data.message;
                }else{
                    document.getElementById("errorText").innerText = data.message;
                }
            }
        });
    }else{
    }
}
document.getElementById("passwordconfirm").onchange = checkPassword;
document.getElementById("password").onchange = checkPassword;
document.getElementById("doneButton").addEventListener("click", submit);
$("#password").on('keyup',function(e){
    if(e.keyCode === 13){
        document.getElementById("passwordconfirm").focus();
    }
});
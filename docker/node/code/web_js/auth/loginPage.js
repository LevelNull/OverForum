function login(){
    var err = document.getElementById("errorText");
    var username = document.getElementById("username");
    var pass = document.getElementById("password");
    if(username.value.length <= 0){
        err.innerText = "Empty Username!";
    }else if(pass.value.length <= 0){
        err.innerText = "Empty Password!";
    }else{
        $.ajax({
            type: "POST",
            url: "/acs",
            data: JSON.stringify(
                {"username":username.value,
                "password":pass.value,
                "returnto":document.referrer
                }),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                if(data.success){
                    document.location = data.goto;
                }else{
                    err.innerText = data.message;
                }
            }
        });
    }
}

document.getElementById("doneButton").addEventListener("click",login);
$("#password").on('keyup',function(e){
    if(e.keyCode === 13){
        login();
    }
});
$("#username").on('keyup',function(e){
    if(e.keyCode === 13){
        document.getElementById("password").focus();
    }
});
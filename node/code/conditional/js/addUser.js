document.getElementById("cancelButton").addEventListener("click",function(){
    document.getElementById("overlayItem").remove();
});
function submitAddUser(){
    if(checkPassword()){
        var payload = {
            firstname:          document.getElementById("firstname").value,
            lastname:           document.getElementById("surname").value,
            username:           document.getElementById("username").value,
            email:              document.getElementById("email").value,
            password:           document.getElementById("password").value,
            passwordconfirm:    document.getElementById("passwordconfirm").value,
            group:              document.getElementById("groupSelector").value,
            usermode:           document.getElementById("userMode").value,
            iknowwhatimdoing:   true
        }
        $.ajax({
            type: "POST",
            url: "panel/addUser",
            data: JSON.stringify(payload),
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                if(data.success){
                    document.getElementById("overlayItem").remove();
                }else{
                    document.getElementById("errorText").innerText = data.message;
                }
            }
        });
    }else{
    }
}

document.getElementById("doneButton").addEventListener("click", submitAddUser);
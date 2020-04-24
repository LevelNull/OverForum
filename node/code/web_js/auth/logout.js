document.getElementById("logoutButton").addEventListener("click",function(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText);
            if(result.success){
                location.reload();
            }
        }
    };
    xhttp.open("POST", "/logout", true);
    xhttp.send();
});
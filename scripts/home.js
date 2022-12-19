LoadUser();


function LoadUser(){
    var userElement = document.getElementById("navusername");
    var pagetitle = document.querySelector("title");
    pagetitle.innerHTML = pagetitle.innerHTML + " " + GetLoggedUser()["username"];;
    //userElement.value = LoggedUser["username"];
    userElement.innerHTML = GetLoggedUser()["username"];
    console.log(userElement);
}

function GetLoggedUser() {
    return JSON.parse(localStorage.getItem("LoggedUser"));
}
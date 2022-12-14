var IsLoggedIn = false;
var LoggedUser = {"username" : "", "password" : ""}
function LogIn(){
    var usersdatabase = GetDatabase();
    var userElement = document.getElementById("SignUsernameText");
    var username = userElement.value;
    var passElement = document.getElementById("SignPasswordText");
    var password = passElement.value;

    if(usersdatabase[username]["Password"] != password)
    {
        return;
    }
    const d = new Date();
    var text = d.toString();
    usersdatabase[username]["Log"] = usersdatabase[username]["Log"] + "\nLogged in on " + text;
    LoggedUser["Username"] = username;
    LoggedUser["Password"] = password;
    SaveDatabase(usersdatabase);
    location.href = "www.yoursite.com";
}


function SignUp(){
    var usersdatabase = GetDatabase();
    var userElement = document.getElementById("SignUsernameText");
    var username = userElement.value;
    var passElement = document.getElementById("SignPasswordText");
    var password = passElement.value;
    if(DoesUserExists(username)){
        console.log("Username already in database!")
        return;
    }
    const d = new Date();
    var text = d.toString();
    var logfile = "Signed up on " + text;
    var User = {"Username" : username, "Password" : password, "Log" : logfile}
    usersdatabase[username] = User;
    SaveDatabase(usersdatabase)
}

function GetDatabase(){ 
    console.log("Loading...");
    var data = JSON.parse(localStorage.getItem("Users"));
    return data != null ? data : {};
}

function SaveDatabase(usersdatabase){
    var data = JSON.stringify(usersdatabase)
    console.log("saving " + data)
    localStorage.setItem("Users", data);
}

function GetUserByUsername(username){ 
    var database = GetDatabase();
    return database[username] != null ? database[username] : null;
}

function DoesUserExists(username){
    return GetUserByUsername(username) != null;
}
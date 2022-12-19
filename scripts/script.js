var IsLoggedIn = false;
var LoggedUser = {"username" : "", "password" : ""}


function LogIn(){
    var usersdatabase = GetDatabase();
    var userElement = document.getElementById("UsernameText");
    var username = userElement.value;
    var passElement = document.getElementById("PasswordText");
    var password = passElement.value;
    if(usersdatabase[username]["Password"] != password)
    {
        console.log("password doesnt match");
        return;
    }
    const d = new Date();
    var text = d.toString();
    usersdatabase[username]["Log"] = usersdatabase[username]["Log"] + "\nLogged in on " + text;
    var addpoints =
     usersdatabase[username]["LastLogin"]["Day"] + 1 != d.getDate() ||
     usersdatabase[username]["LastLogin"]["Month"] != d.getMonth() ||
     usersdatabase[username]["LastLogin"]["Year"] != d.getFullYear(); 
    LoggedUser["username"] = username;
    LoggedUser["password"] = password;
    SaveDatabase(usersdatabase);
    if(addpoints){
        AddToScore(5, username, "daily login");
    }
    SaveLoggedUser();
    LoadHomePage();
}

function AddUserLog(Log, username){
    var usersdatabase = GetDatabase();
    usersdatabase[username]["Log"] = usersdatabase[username]["Log"] + "\n" + Log;
    SaveDatabase(usersdatabase);
    return usersdatabase;
}

function SignUp(){
    var usersdatabase = GetDatabase();
    var userElement = document.getElementById("UsernameText");
    var username = userElement.value;
    var passElement = document.getElementById("PasswordText");
    var password = passElement.value;
    if(!UsernameIsValid(username)) return;
    
    const d = new Date();
    var text = d.toString();
    var logfile = "Signed up on " + text;

    var User = {"Username" : username, "Password" : password, "Score" : 0, "Log" : logfile, "LastLogin" : {"Day" : d.getDate(), "Month" : d.getMonth(), "Year" : d.getFullYear()} }
    usersdatabase[username] = User;
    SaveDatabase(usersdatabase)
    AddToScore(20, username, "Signing up")
}

function UsernameIsValid(username) {
    if(DoesUserExists(username)){
        console.log("Username already in database!")
        return false;
    }
    if(username == ""){
        console.log("Invalid username!")
        return false;
    }
    return true;
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
    console.log(database[username] != null)
    return database[username] != null ? database[username] : null;
}

function DoesUserExists(username){
    return GetUserByUsername(username) != null;
}

function DeleteDatabase(){
    SaveDatabase({});
}

function AddToScore(score, username, scorefor){
    var usersdatabase = GetDatabase();
    usersdatabase[username]["Log"] = usersdatabase[username]["Log"] + "\n" + "Added " + score + " to score" + (scorefor != "" ? (" for " + scorefor) : "");
    usersdatabase[username]["Score"] = usersdatabase[username]["Score"] + score;
    SaveDatabase(usersdatabase);
}

function LoadHomePage(){ 
    console.log("Loading other page");
    window.location.replace("../pages/home.html");
    return;
    var SigninDiv = document.getElementById("signin");
    SigninDiv.classList.add("hidden");
    var ContentDiv = document.getElementById("maincontent");
    ContentDiv.classList.remove("hidden");
    var userElement = document.getElementById("navusername");
    var pagetitle = document.querySelector("title");
    pagetitle.innerHTML = "Home";
    //userElement.value = LoggedUser["username"];
    userElement.innerHTML = LoggedUser["username"];
    console.log(userElement);
}

function SaveLoggedUser() {
     localStorage.setItem("LoggedUser", JSON.stringify(LoggedUser));
}
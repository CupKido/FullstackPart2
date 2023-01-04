import * as db from "../scripts/dbfuncs.js";

var loginFails = 0;
if (db.GetLoggedUser()["username"] != "") {
    var LoggedOutUser = db.GetLoggedUser()["username"];
    if (IsLastLoginDay(LoggedOutUser)) {
        db.LogOut();
    } else {
        document.getElementById("UsernameText").value = db.GetLoggedUser()["username"];
        document.getElementById("PasswordText").value = db.GetLoggedUser()["password"];
        LogIn();
    }
}

document.getElementById("LogInButton").addEventListener("click", LogIn);
document.getElementById("SignUpButton").addEventListener("click", SignUp);


function LogIn() {
    HideErrors();
    if(loginFails > 3){
        ShowManyFailsError();
        return;
    }
    var usersdatabase = db.GetDatabase();
    var userElement = document.getElementById("UsernameText");
    var username = userElement.value;
    var passElement = document.getElementById("PasswordText");
    var password = passElement.value;
    if(usersdatabase[username] == undefined || usersdatabase[username] == null) {
        loginFails += 1;
        ShowUserError();
        return;
     }
    if (usersdatabase[username]["Password"] != password) {
        loginFails += 1;
        console.log("password doesnt match");
        ShowPasswordError();
        return;
    }

    db.SaveDatabase(usersdatabase);
    if (IsLastLoginDay(username)) {
        db.AddToScore(5, username, "daily login");
        UpdateLastLogin(username);
    }
    db.SaveLoggedUser(username, password);
    LoadHomePage();
}



function SignUp() {
    var usersdatabase = db.GetDatabase();
    var userElement = document.getElementById("UsernameText");
    var username = userElement.value;
    var passElement = document.getElementById("PasswordText");
    var password = passElement.value;
    if (!UsernameIsValid(username)) {
        alert("Username already taken!")
        return;
    }

    const d = new Date();
    var text = d.toString();
    var logfile = "Signed up on " + text;

    var User = { "Username": username, "Password": password, "Score": 0, "Log": logfile, "LastLogin": { "Day": d.getDate(), "Month": d.getMonth(), "Year": d.getFullYear() } }
    usersdatabase[username] = User;
    db.SaveDatabase(usersdatabase)
    db.AddToScore(20, username, "Signing up")
}

function UsernameIsValid(username) {
    if (DoesUserExists(username)) {
        console.log("Username already in database!")
        return false;
    }
    if (username == "") {
        console.log("Invalid username!")
        return false;
    }
    return true;
}

function GetUserByUsername(username) {
    var database = db.GetDatabase();
    console.log(database[username] != null)
    return database[username] != null ? database[username] : null;
}

function DoesUserExists(username) {
    return GetUserByUsername(username) != null;
}

function LoadHomePage() {
    console.log("Loading other page");
    window.location.replace("../pages/home.html");
    return;
}

function IsLastLoginDay(username) {
    var usersdatabase = db.GetDatabase();
    const d = new Date();
    var text = d.toString();
    usersdatabase[username]["Log"] = usersdatabase[username]["Log"] + "\nLogged in on " + text;
    var sameDay =
        usersdatabase[username]["LastLogin"]["Day"] != d.getDate() ||
        usersdatabase[username]["LastLogin"]["Month"] != d.getMonth() ||
        usersdatabase[username]["LastLogin"]["Year"] != d.getFullYear();
    return sameDay;
}

function UpdateLastLogin(username) {
    var usersdatabase = db.GetDatabase();

    const d = new Date();
    var text = d.toString();
    var login = { "Day": d.getDate(), "Month": d.getMonth(), "Year": d.getFullYear() };
    usersdatabase[username]["LastLogin"] = login;
    db.SaveDatabase(usersdatabase);
}

function ShowUserError(){ 
    var label = document.getElementById("BadUsernameLabel");
    label.classList.remove("hidden");
}

function ShowManyFailsError(){
    var label = document.getElementById("ManyTrialsLabel");
    label.classList.remove("hidden");
}

function ShowPasswordError(){ 
    var label = document.getElementById("BadPasswordLabel");
    label.classList.remove("hidden");
}

function HideErrors(){
    var label1 = document.getElementById("BadPasswordLabel");
    label1.classList.add("hidden");
    var label2 = document.getElementById("BadUsernameLabel");
    label2.classList.add("hidden");
}
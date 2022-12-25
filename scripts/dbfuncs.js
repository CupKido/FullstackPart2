export var IsLoggedIn = false;
export var LoggedUser = { "username": "", "password": "" }

export function AddUserLog(Log, username) {
    var usersdatabase = GetDatabase();
    usersdatabase[username]["Log"] = usersdatabase[username]["Log"] + "\n" + Log;
    SaveDatabase(usersdatabase);
    return usersdatabase;
}

export function GetDatabase() {
    console.log("Loading...");
    var data = JSON.parse(localStorage.getItem("Users"));
    return data != null ? data : {};
}

export function DeleteDatabase() {
    SaveDatabase({});
}

export function AddToScore(score, username, scorefor) {
    var usersdatabase = this.GetDatabase();
    console.log(usersdatabase)
    console.log(usersdatabase[username])
    console.log(usersdatabase[username]["Log"])
    usersdatabase[username]["Log"] = usersdatabase[username]["Log"] + "\n" + "Added " + score + " to score" + ((scorefor != "") ? (" for " + scorefor) : (""));
    usersdatabase[username]["Score"] = usersdatabase[username]["Score"] + score;
    SaveDatabase(usersdatabase);
}
export function GetUserScore(username) {
    var usersdatabase = GetDatabase();
    return usersdatabase[username]["Score"];
}
export function SaveDatabase(usersdatabase) {
    var data = JSON.stringify(usersdatabase)
    console.log("saving " + data)
    localStorage.setItem("Users", data);
}

export function SaveLoggedUser(username, password) {
    LoggedUser["username"] = username;
    LoggedUser["password"] = password;
    localStorage.setItem("LoggedUser", JSON.stringify(LoggedUser));
}

export function GetLoggedUser() {
    return JSON.parse(localStorage.getItem("LoggedUser"));
}

export function LoadUser() {
    var userElement = document.getElementById("navusername");
    var pagetitle = document.querySelector("title");
    pagetitle.innerHTML = pagetitle.innerHTML + " " + GetLoggedUser()["username"];;
    //userElement.value = LoggedUser["username"];
    LoggedUser = GetLoggedUser();
    userElement.innerHTML = "user: " + LoggedUser["username"] + "<br>Score: " + GetUserScore(LoggedUser["username"]);
    console.log("loading user: \n" + userElement);

}

export function LogOut() {
    SaveLoggedUser("", "");
}
import * as db from '../scripts/dbfuncs.js'


db.LoadUser();
//document.querySelector("title").innerHTML = db.GetLoggedUser()["username"]
LoadUserView();
var passIsShown = false;


function LoadUserView(){

    var usernameText = document.getElementById("usernameDisplay")
    if(usernameText){
        usernameText.innerHTML = db.GetLoggedUser()["username"]
    }
    var scoreText = document.getElementById("scoreDisplay")
    if(scoreText){
        var username = db.GetLoggedUser()["username"]
        
        scoreText.innerHTML = db.GetUserScore(username)
        
    }
    var passwordText = document.getElementById("passwordDisplay")
    if(passwordText){
        var pass = db.GetLoggedUser()["password"]
        passwordText.innerHTML = new Array(pass.length + 1).join("*")
        passwordText.addEventListener("click", switchShown)
    }
    
    
}

function switchShown(){
    var passwordText = document.getElementById("passwordDisplay")
    if(passwordText){
        if (passIsShown){
            var pass = db.GetLoggedUser()["password"]
            passwordText.innerHTML = new Array(pass.length + 1).join("*")
        }else{
            passwordText.innerHTML = db.GetLoggedUser()["password"];
        }
        passIsShown = !passIsShown;
   
    }
}
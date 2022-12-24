import * as db from '../scripts/dbfuncs.js'


db.LoadUser();




function GetLoggedUser() {
    return JSON.parse(localStorage.getItem("LoggedUser"));
}
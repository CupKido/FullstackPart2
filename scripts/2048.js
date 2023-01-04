import * as db from '../scripts/dbfuncs.js'
db.LoadUser();
var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function () {
    setGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
           
            let num = board[r][c]; 
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    //create 2 two to begin the game
    setTwo();
    setTwo();

}

function  updateTile(tile, num) {
    tile.innerText = "";     
    tile.classList.value = ""; //clear the classList  enleve la couleur de carre a update
    tile.classList.add("tile");           
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 8192) {
            tile.classList.add("x" + num.toString());
        } 
       /* else {
            tile.classList.add("x8192"); 
        }*/
    }
}

document.addEventListener('keyup', (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();

        if (setTwo() == false) {
            endGame();
        }
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        if (setTwo() == false) {
            endGame();
        }
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        if (setTwo() == false) {
            endGame();
        }

    }
    else if (e.code == "ArrowDown") {
        slideDown();
        if (setTwo() == false) {
            endGame();
        }
    }
    document.getElementById("score").innerText = score;
})

function endGame() {
    alert("Game Over" + " " + "Your score is: " + score + "\n" + db.LoggedUser["username"] + " Thank you for playing!");

    if (score > 0) {
        db.AddToScore(Math.ceil(score / 200), db.GetLoggedUser()["username"], "2048 game")
        db.LoadUser()
    }
}

function filterZero(row) {
    return row.filter(num => num != 0); //create new array of all nums != 0 obviously it returns a copy not the original
}

function slide(row) {
    //[0, 2, 2, 2] 
    row = filterZero(row); //[2, 2, 2] 
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;   //[4, 0, 2]
            score += row[i];
        }
    } 
    row = filterZero(row); //[4, 2]
    //add zeroes
    while (row.length < columns) {
        row.push(0);
    } //[4, 2, 0, 0]
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row; //update the board back 
        for (let c = 0; c < columns; c++) {  //update the board ui
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() { //same as slide func used for left but in reverse order therefore we reverse before slide and after
    for (let r = 0; r < rows; r++) {
        let row = board[r];         //[0, 2, 2, 2]
        row.reverse();              //[2, 2, 2, 0]
        row = slide(row)            //[4, 2, 0, 0]
        board[r] = row.reverse();   //[0, 0, 2, 4];
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() { //here we also want to use slide func so we need to transpose the column to a row and then back in
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r]; //transpose back to the column like commented above but here is quicker
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() { //transpose and reverse and then back in
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r]; 
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) { //if there is no place gameover
        return false;
    }
    let found = false; //heve we found an empty place founded on the board to put a 2
    while (!found) {  
        //find random row and column to place a 2 in
        let r = Math.floor(Math.random() * rows); //floor gives set to an int 
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}
let context;
let shape = {};
let board;
let score;
let pac_color;
let start_time;
let time_elapsed;
let interval = 0;
let users = {"a": "a"};
//add
let BallsN;
let c5;
let c15;
let c25;
let Time;
let ghostsN;
let movement = 3;
let ghost1 = {};
let ghost2 = [15, 15];
let ghost3 = [15, 15];
let enemyC = 0;
let candy = {};
let themSound;
let winSound;
let loseSound;
let health;
let imgGhost;
let imgCandy;
let imgPsydac;
let Psy = {};
let imgHeart;
let heart = {};

/**     after load preperation            */
$(document).ready(function () {


    context = $("#canvas")[0].getContext("2d");
    $("#login-button").click(function () {
        showLogin();
        return false;
    });
    $("#register-button").click(function () {
        showRegistre();
        return false;
    });

    $("#menu-welcome").click(function () {
        showWelcome();
        return false;
    });
    $("#menu-register").click(function () {
        showRegistre();
        return false;
    });
    $("#menu-login").click(function () {
        showLogin();
        return false;
    });
    $("#submit-gameSet").click(function () {
        //get the game settings
        BallsN = document.getElementById("BallsN").value;
        c5 = document.getElementById("5color").value;
        c15 = document.getElementById("15color").value;
        c25 = document.getElementById("25color").value;
        Time = document.getElementById("Time").value;
        if (Time === "50s") {
            Time = 50;
        }
        else if (Time === "60s") {
            Time = 60;
        }
        else if (Time === "70s") {
            Time = 70;
        }
        else if (Time === "80s") {
            Time = 80;
        }
        else if (Time === "90s") {
            Time = 90;
        }
        ghostsN = document.getElementById("GhostsN").value;
        if (ghostsN === "1") {
            ghostsN = 1;
        }
        else if (ghostsN === "2") {
            ghostsN = 2;
        }
        else ghostsN = 3;
        showGame();
    })

    $("#submit-register").click(function () {
        let username = $("#username").val();
        let password = $("#password").val();
        let firstName = $("#first-name").val();
        let lastName = $("#last-name").val();
        let email = $("#email").val();
        let birthday = $("#birthday").val();

        if (username === "" || password === "" || firstName === "" || lastName === "" || email === "" || birthday === "") {
            alert("You didn't insert one of the fields");
        }
        else if (username in users) {
            alert("This username is already exists");
        }
        else if (password.length < 8 || !checkPass(password)) {
            alert("Password needs to be 8 chars minimum and contains only digits and letters")
        }
        else if (!checkFirstLastName(firstName) || !checkFirstLastName(lastName)) {
            alert("First and last name should contain only letters")
        }
        else if (!isValidEmailAddress(email)) {
            alert("The email you insert in invalid, please try again");
        }
        else {
            users[username] = password;
            $("#register-form")[0].reset();
            showLogin();
        }
        return false;
    });

    $("#submit-login").click(function () {
        let username = document.getElementById("login-username").value;
        let password = document.getElementById("login-password").value;

        if (null !== username && null !== password && users[username] === password) {
            showPreGame();
        }
        else {
            alert("username or password is incorrect");
        }
        return false;
    });

    $('#start').click(function () {
        if (interval !== 0) {
            window.clearInterval(interval);
        }
        showPreGame();
    });

    $("#menu-about").click(function () {
        $("#about")[0].showModal();
    });

    $("#modal").click(function () {
        $("#about")[0].close();
    });
    showWelcome();

});


function Start() {
    board = [];
    score = 0;
    pac_color = "yellow";
    let cnt = 100;
    let food_remain = BallsN;
    let pacman_remain = 1;
    //sound
    winSound = document.getElementById("win-Sound");
    loseSound = document.getElementById("lose-Sound");
    loseSound.pause();
    loseSound.currentTime = 0;
    winSound.pause();
    winSound.currentTime = 0;
    themSound = document.getElementById("Them-Sound");
    themSound.play();
    imgCandy = new Image();
    imgCandy.src = "Candy.png";
    imgPsydac = new Image();
    imgPsydac.src = "psy.png";
    imgHeart = new Image();
    imgHeart.src = "heart.png";
    imgGhost = new Image();
    imgGhost.src = "Ghost.png";
    //health
    health = 3;

    start_time = new Date();
    for (let i = 0; i < 10; i++) {
        board[i] = [];
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (let j = 0; j < 10; j++) {
            if ((i === 3 && j === 3) || (i === 3 && j === 4) || (i === 3 && j === 5) || (i === 6 && j === 1) || (i === 6 && j === 2)) {
                board[i][j] = 4;
            }
            else board[i][j] = 0;

        }
    }
    let flag = true;
    while (flag) {
        let emptyCell = findRandomEmptyCell(board);
        if (emptyCell[0] > 0 && emptyCell[0] < 9 && emptyCell[1] > 0 && emptyCell[1] < 9) {
            shape.i = emptyCell[0];
            shape.j = emptyCell[1];
            board[emptyCell[0]][emptyCell[1]] = 2;
            flag = false;
        }
    }
    let emptyCell = findRandomEmptyCell(board);
    Psy[0] = emptyCell[0];
    Psy[1] = emptyCell[1];
    Psy[2] = 1;
    Psy[3] = 0;
    Psy[4] = 0;
    heart[0] = 0;
    heart[1] = 0;
    heart[2] = 0;
    while (food_remain > 0) {
        let emptyCell = findRandomEmptyCell(board);
        if (BallsN - food_remain < BallsN * 0.6) {
            board[emptyCell[0]][emptyCell[1]] = 5;
            food_remain--;
        }
        else if (BallsN - food_remain < BallsN * 0.9) {
            board[emptyCell[0]][emptyCell[1]] = 15;
            food_remain--;
        }
        else {
            board[emptyCell[0]][emptyCell[1]] = 25;
            food_remain--;
        }
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        e.preventDefault();
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        e.preventDefault();
        keysDown[e.keyCode] = false;
    }, false);
    //put the ghosts at corners
    ghost1[0] = 0;
    ghost1[1] = 0;
    if (ghostsN <= 2) {
        ghost2[0] = 9;
        ghost2[1] = 0;
        if (ghostsN <= 3) {
            ghost3[0] = 0;
            ghost3[1] = 9;
        }
    }
    candy[0] = 9;
    candy[1] = 9;
    candy[2] = 1;

    interval = setInterval(UpdatePosition, 200);
}


function findRandomEmptyCell(board) {
    let i = Math.floor((Math.random() * 10));
    let j = Math.floor((Math.random() * 10));
    while (board[i][j] !== 0) {
        i = Math.floor((Math.random() * 10));
        j = Math.floor((Math.random() * 10));
    }
    return [i, j];
}

/**
 * @return {number}
 */
function GetKeyPressed() {
    if (keysDown[38]) {
        return 1;
    }
    if (keysDown[40]) {
        return 2;
    }
    if (keysDown[37]) {
        return 3;
    }
    if (keysDown[39]) {
        return 4;
    }
}


function Draw() {
    canvas.width = canvas.width; //clean board
    lblScore.value = score;
    lblTime.value = Time - time_elapsed;
    lbLives.value = health;

    const center = {};
    if (Psy[2] === 0 && Psy[4] < 10) {
        pac_color = "red";
    }
    else pac_color = "yellow";
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {

            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            if (board[i][j] === 2) {
                context.beginPath();
                if (movement === 1) {
                    context.arc(center.x, center.y, 30, (1.5 + 0.15) * Math.PI, (1.5 + 1.85) * Math.PI);//up
                    context.lineTo(center.x, center.y);

                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 15, center.y - 5, 5, 0, 2 * Math.PI); // circle

                    context.fillStyle = "white"; //color
                    context.fill();
                }
                else if (movement === 2) {
                    context.arc(center.x, center.y, 30, (0.5 + 0.15) * Math.PI, (0.5 + 1.85) * Math.PI);//down
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 15, center.y + 5, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "white"; //color
                    context.fill();
                }
                else if (movement === 3) {
                    context.arc(center.x, center.y, 30, (1 + 0.15) * Math.PI, (1 + 1.85) * Math.PI);//left
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "white"; //color
                    context.fill();
                }
                else if (movement === 4) {
                    context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI);//right
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "white"; //color
                    context.fill();
                }
            } else if (board[i][j] === 5 || board[i][j] === 15 || board[i][j] === 25) {  //balls
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                if (board[i][j] === 5) {
                    context.fillStyle = c5; //color
                }
                else if (board[i][j] === 15) {
                    context.fillStyle = c15; //color
                }
                else context.fillStyle = c25; //color
                context.fill();
            }
            else if (board[i][j] === 4) {  //obsecal
                context.beginPath();
                context.rect(center.x - 30, center.y - 30, 60, 60);
                context.fillStyle = "blue"; //color
                context.fill();
            }
        }
    }
    // draw ghosts
    center.x = ghost1[0] * 60;
    center.y = ghost1[1] * 60;
    context.drawImage(imgGhost, center.x, center.y, 50, 50);
    if (ghostsN <= 2) {
        center.x = ghost2[0] * 60;
        center.y = ghost2[1] * 60;
        context.drawImage(imgGhost, center.x, center.y, 50, 50);
    }
    if (ghostsN <= 3) {
        center.x = ghost3[0] * 60;
        center.y = ghost3[1] * 60;
        context.drawImage(imgGhost, center.x, center.y, 50, 50);
    }
    //draw candy
    if (candy[2] === 1) {
        center.x = candy[0] * 60;
        center.y = candy[1] * 60;
        context.drawImage(imgCandy, center.x, center.y, 50, 50);
    }

    if (Psy[2] === 1) {
        center.x = Psy[0] * 60;
        center.y = Psy[1] * 60;
        context.drawImage(imgPsydac, center.x, center.y, 50, 50);
    }
    if (heart[2] === 1) {
        center.x = heart[0] * 60;
        center.y = heart[1] * 60;
        context.drawImage(imgHeart, center.x, center.y, 50, 50);
    }
}

/**
 * @return {boolean}
 */
function UpdatePosition() {
    enemyC++;
    enemyC = enemyC % 5;
    board[shape.i][shape.j] = 0;
    let x = GetKeyPressed();
    if (Psy[2] === 0 && Psy[4] < 10) {
        if (x == 1) {
            x = 2;
        } else if (x === 2) {
            x = 1;
        } else if (x === 3) {
            x = 4;
        } else if (x === 4) {
            x = 3;
        }
    }
    if (x === 1) {
        if (shape.j > 0 && board[shape.i][shape.j - 1] !== 4) {
            shape.j--;
            movement = x;
        }
    }
    if (x === 2) {
        if (shape.j < 9 && board[shape.i][shape.j + 1] !== 4) {
            shape.j++;
            movement = x;
        }
    }
    if (x === 3) {
        if (shape.i > 0 && board[shape.i - 1][shape.j] !== 4) {
            shape.i--;
            movement = x;
        }
    }
    if (x === 4) {
        if (shape.i < 9 && board[shape.i + 1][shape.j] !== 4) {
            shape.i++;
            movement = x;
        }
    }
    if (board[shape.i][shape.j] === 5) {
        if (Psy[2] === 0 && Psy[4] < 10) {
            score += 10;
            BallsN--;
        }
        else {
            score += 5;
            BallsN--;
        }
    }
    if (board[shape.i][shape.j] === 15) {
        if (Psy[2] === 0 && Psy[4] < 10) {
            score += 30;
            BallsN--;
        } else {
            score += 15;
            BallsN--;
        }
    }
    if (board[shape.i][shape.j] === 25) {
        if (Psy[2] === 0 && Psy[4] < 10) {
            score += 50;
            BallsN--;
        }
        else {
            score += 25;
            BallsN--;
        }
    }
    if (heart[2] === 1 && shape.i === heart[0] && shape.j === heart[1]) {
        heart[2] = 2;
        health++;
    }
    if (shape.i === candy[0] && shape.j === candy[1] && candy[2] !== 0) {
        if (Psy[2] === 0 && Psy[4] < 10) {
            score += 100;
            BallsN--;
        }
        candy[2] = 0;
        score = score + 50;
    }
    if (shape.i === Psy[0] && shape.j === Psy[1] && Psy[2] === 1) {
        Psy[2] = 0;
        Psy[3] = new Date()
    }
    else if (Psy[2] === 0) {
        let currentTime = new Date();
        Psy[4] = ((currentTime - Psy[3]) / 1000);
    }
    if (!isAlive(board)) { //post pac move
        health--;
        Draw();
        if (health > 0) {
            reset();
        }
    }
    board[shape.i][shape.j] = 2;
    if (enemyC === 4 && isAlive(board)) {//move enemy
        moveEnemy1(board);
        if (ghostsN <= 2) {
            moveEnemy2(board);
        }
        if (ghostsN <= 3) {
            moveEnemy3(board);
        }
        candyMove(board);
    }
    if (!isAlive(board)) { //post enemy move
        health--;
        Draw(board);
        if (health > 0) {
            reset();
        }
    }
    let currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    if (time_elapsed > 10 && heart[2] === 0) {
        heart[2] = 1;
        let pos = findRandomEmptyCell(board);
        heart[0] = pos[0];
        heart[1] = pos[1];
    }
    if (score >= 20 && time_elapsed <= 10) {
        pac_color = "green";
    }
    if (BallsN === 0) {

        themSound.pause();
        themSound.currentTime = 0;
        winSound.play();
        window.clearInterval(interval);

        if (score < 150) {
            window.alert("You can do better");
        }
        else {
            window.alert("We have a Winner!!!");
        }

    }
    else if (health <= 0 || Time - time_elapsed < 0) {
        themSound.pause();
        themSound.currentTime = 0;
        loseSound.play();
        window.clearInterval(interval);
        window.alert("You Lost!");
    }
    else {
        Draw();
    }
    return false;
}

function reset() {
    board[shape.i][shape.j] = 0;
    let emptyCell = findRandomEmptyCell(board);
    board[emptyCell[0]][emptyCell[1]] = 2;
    shape.i = emptyCell[0];
    shape.j = emptyCell[1];
    ghost1[0] = 0;
    ghost1[1] = 0;
    if (ghostsN <= 2) {
        ghost2[0] = 9;
        ghost2[1] = 0;
    }
    if (ghostsN <= 3) {
        ghost3[0] = 0;
        ghost3[1] = 9;
    }
    if (candy[2] !== 0) {
        candy[0] = 8;
        candy[1] = 8;
    }
    Draw(board);
}

function candyMove(board) {
    let axis = Math.floor((Math.random() * 2) + 1);
    let pos = Math.floor((Math.random() * 2) + 1);
    if (axis === 1) {
        if (pos === 1) {
            if (FreeCell(candy[0] + 1, candy[1])) {
                candy[0]++;
            }
        }
        else if (FreeCell(candy[0] - 1, candy[1])) {
            candy[0]--;
        }
    }
    else {
        if (pos === 1) {
            if (FreeCell(candy[0], candy[1] + 1)) {
                candy[1]++;
            }
        }
        else if (FreeCell(candy[0], candy[1] - 1)) {
            candy[1]--;
        }
    }
}

function moveEnemy1(board) {
    let x = ghost1[0];
    let y = ghost1[1];
    let xDist = shape.i - x;
    let yDist = shape.j - y;

    if ((xDist * xDist) > (yDist * yDist)) {//xDist grater then yDist
        if (xDist > 0) {
            if (FreeCell(x + 1, y)) {
                ghost1[0]++;
            }
            else if (yDist > 0) {
                if (FreeCell(x, y + 1)) {
                    ghost1[1]++;
                }
            }
            else if (yDist < 0) {
                if (FreeCell(x, y - 1)) {
                    ghost1[1]--;
                }
            }
        }
        else if (xDist < 0) {
            if (FreeCell(x - 1, y)) {
                ghost1[0]--;
            }
            else if (yDist > 0) {
                if (FreeCell(x, y + 1)) {
                    ghost1[1]++;
                }
            }
            else if (yDist < 0) {
                if (FreeCell(x, y - 1)) {
                    ghost1[1]--;
                }
            }
        }
    }
    else {
        if (yDist > 0) {
            if (FreeCell(x, y + 1)) {
                ghost1[1]++;
            }
            else if (xDist > 0) {
                if (FreeCell(x + 1, y)) {
                    ghost1[0]++;
                }
            }
            else if (xDist < 0) {
                if (FreeCell(x - 1, y)) {
                    ghost1[0]--;
                }
            }
        }
        else if (yDist < 0) {
            if (FreeCell(x, y - 1)) {
                ghost1[1]--;
            }
            else if (xDist > 0) {
                if (FreeCell(x + 1, y)) {
                    ghost1[0]++;
                }
            }
            else if (xDist < 0) {
                if (FreeCell(x - 1, y)) {
                    ghost1[0]--;
                }
            }
        }
    }

}

function moveEnemy2(board) {
    let x = ghost2[0];
    let y = ghost2[1];
    let xDist = shape.i - x;
    let yDist = shape.j - y;

    if ((xDist * xDist) > (yDist * yDist)) {//xDist gratter then yDist
        if (xDist > 0) {
            if (FreeCell(x + 1, y)) {
                ghost2[0]++;
            }
            else if (yDist > 0) {
                if (FreeCell(x, y + 1)) {
                    ghost2[1]++;
                }
            }
            else if (yDist < 0) {
                if (FreeCell(x, y - 1)) {
                    ghost2[1]--;
                }
            }
        }
        else if (xDist < 0) {
            if (FreeCell(x - 1, y)) {
                ghost2[0]--;
            }
            else if (yDist > 0) {
                if (FreeCell(x, y + 1)) {
                    ghost2[1]++;
                }
            }
            else if (yDist < 0) {
                if (FreeCell(x, y - 1)) {
                    ghost2[1]--;
                }
            }
        }
    }
    else {
        if (yDist > 0) {
            if (FreeCell(x, y + 1)) {
                ghost2[1]++;
            }
            else if (xDist > 0) {
                if (FreeCell(x + 1, y)) {
                    ghost2[0]++;
                }
            }
            else if (xDist < 0) {
                if (FreeCell(x - 1, y)) {
                    ghost2[0]--;
                }
            }
        }
        else if (yDist < 0) {
            if (FreeCell(x, y - 1)) {
                ghost2[1]--;
            }
            else if (xDist > 0) {
                if (FreeCell(x + 1, y)) {
                    ghost2[0]++;
                }
            }
            else if (xDist < 0) {
                if (FreeCell(x - 1, y)) {
                    ghost2[0]--;
                }
            }
        }
    }

}

function moveEnemy3(board) {
    let x = ghost3[0];
    let y = ghost3[1];
    let xDist = shape.i - x;
    let yDist = shape.j - y;

    if ((xDist * xDist) > (yDist * yDist)) {//xDist gratter then yDist
        if (xDist > 0) {
            if (FreeCell(x + 1, y)) {
                ghost3[0]++;
            }
            else if (yDist > 0) {
                if (FreeCell(x, y + 1)) {
                    ghost3[1]++;
                }
            }
            else if (yDist < 0) {
                if (FreeCell(x, y - 1)) {
                    ghost3[1]--;
                }
            }
        }
        else if (xDist < 0) {
            if (FreeCell(x - 1, y)) {
                ghost3[0]--;
            }
            else if (yDist > 0) {
                if (FreeCell(x, y + 1)) {
                    ghost3[1]++;
                }
            }
            else if (yDist < 0) {
                if (FreeCell(x, y - 1)) {
                    ghost3[1]--;
                }
            }
        }
    }
    else {
        if (yDist > 0) {
            if (FreeCell(x, y + 1)) {
                ghost3[1]++;
            }
            else if (xDist > 0) {
                if (FreeCell(x + 1, y)) {
                    ghost3[0]++;
                }
            }
            else if (xDist < 0) {
                if (FreeCell(x - 1, y)) {
                    ghost3[0]--;
                }
            }
        }
        else if (yDist < 0) {
            if (FreeCell(x, y - 1)) {
                ghost3[1]--;
            }
            else if (xDist > 0) {
                if (FreeCell(x + 1, y)) {
                    ghost3[0]++;
                }
            }
            else if (xDist < 0) {
                if (FreeCell(x - 1, y)) {
                    ghost3[0]--;
                }
            }
        }
    }

}

function isAlive(board) {
    if (shape.i === ghost1[0] && shape.j === ghost1[1]) {
        return 0;
    }
    else if (ghostsN <= 2 && shape.i === ghost2[0] && shape.j === ghost2[1]) {
        return 0;
    }
    else if (ghostsN <= 3 && shape.i === ghost3[0] && shape.j === ghost3[1]) {
        return 0;
    }

    return 1;

}


/**
 * @return {number}
 */
function FreeCell(x, y) {
    if (x >= 0 && x < 10) {
        if (y >= 0 && y < 10) {
            if (board[x][y] !== 4) {//not obsecal
                if (ghost1[0] !== x || ghost1[1] !== y) {
                    if (ghost2[0] !== x || ghost2[1] !== y) {
                        if (ghost3[0] !== x || ghost3[1] !== y) {
                            if (candy[2] === 1) {
                                if (candy[0] !== x || candy[1] !== y) {
                                    return 1;
                                }
                            }
                            else return 1;
                        }
                    }
                }
            }
        }
    }
    return 0;
}

function showWelcome() {
    $("#welcome").show();
    $("#register").hide();
    $("#login").hide();
    $("#game").hide();
    $("#pre-game").hide();
}

function showRegistre() {
    $("#welcome").hide();
    $("#register").show();
    $("#login").hide();
    $("#game").hide();
    $("#pre-game").hide();
}

function showLogin() {
    $("#welcome").hide();
    $("#register").hide();
    $("#login").show();
    $("#game").hide();
    $("#pre-game").hide();
}

function showGame() {
    $("#welcome").hide();
    $("#register").hide();
    $("#login").hide();
    $("#pre-game").hide();
    $("#game").show();

    Start();
}

function showPreGame() {
    $("#welcome").hide();
    $("#register").hide();
    $("#login").hide();
    $("#game").hide();
    $("#pre-game").show();
}

/** validation funcs**/
function checkPass(password) {
    let regex = new RegExp("^[a-zA-Z0-9]+$");
    return regex.test(password);

}

function checkFirstLastName(name) {
    let regex = new RegExp(/^[a-zA-Z()]+$/);
    return regex.test(name);
}

function isValidEmailAddress(emailAddress) {
    let regex = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
    return regex.test(emailAddress);
}




let context;
let shape = {};
let board;
let score;
let pac_color;
let start_time;
let time_elapsed;
let interval;
let users = {"a": "a"};
//add
let movement=3;
let ghost1={};
let ghost2={};
let ghost3={};
let ghost4={};
let enemyC=0;
let candy={};
let themSound;
let winSound;
let loseSound;
let health;
let imgGhost;
let imgCandy;

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

    $("#submit-register").click(function () {
        let username = $("#username").val();
        let password =$("#password").val();
        let firstName = $("#first-name").val();
        let lastName = $("#last-name").val();
        let email = $("#email").val();
        let birthday = $("#birthday").val();

        if (username === "" || password === "" || firstName === "" || lastName === "" || email ==="" || birthday ==="")
        {
            alert("You didn't insert one of the fields");
        }
        else if (username in users) {
            alert("This username is already exists");
        }
        else if (password.length < 8 || !checkPass(password))
        {
            alert("Password needs to be 8 chars minimum and contains only digits and letters")
        }
        else if (!checkFirstLastName(firstName) || !checkFirstLastName(lastName))
        {
            alert("First and last name should contain only letters")
        }
        else if(!isValidEmailAddress(email))
        {
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

        if (null !== username && null !== password && users[username] === password)
        {
            showGame();
        }
        else
        {
            alert("username or password is incorrect");
        }
        return false;
    });

    $("#start").click(function () {
        Start();
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
    let food_remain = 50;
    let pacman_remain = 1;
    //sound
    winSound=document.getElementById("win-Sound");
    loseSound=document.getElementById("lose-Sound");
    loseSound.pause();
    loseSound.currentTime = 0;
    winSound.pause();
    winSound.currentTime = 0;
    themSound=document.getElementById("Them-Sound");
    themSound.play();
    imgCandy=new Image();
    imgCandy.src="Candy.png";


    imgGhost=new Image();
    imgGhost.src="Ghost.png";
    //health
    health=3;

    start_time = new Date();
    for (let i = 0; i < 10; i++) {
        board[i] = [];
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (let j = 0; j < 10; j++) {
            if ((i === 3 && j === 3) || (i === 3 && j === 4) || (i === 3 && j === 5) || (i === 6 && j === 1) || (i === 6 && j === 2)) {
                board[i][j] = 4;
            }
            else {
                let randomNum = Math.random();
                if (randomNum <= 1.0 * food_remain / cnt) {
                    food_remain--;
                    board[i][j] = 1;
                } else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
                    shape.i = i;
                    shape.j = j;
                    pacman_remain--;
                    board[i][j] = 2;
                } else {
                    board[i][j] = 0;
                }
                cnt--;
            }
        }


    }
    while (food_remain > 0) {
        let emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 1;
        food_remain--;
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);
    //put the ghosts at corners
    ghost1[0]=0;
    ghost1[1]=0;
    ghost2[0]=9;
    ghost2[1]=0;
    ghost3[0]=0;
    ghost3[1]=9;
    ghost4[0]=9;
    ghost4[1]=9;
    candy[0]=8;
    candy[1]=8;
    candy[2]=1;

    interval = setInterval(UpdatePosition, 200);
}


function findRandomEmptyCell(board) {
    let i = Math.floor((Math.random() * 9) + 1);
    let j = Math.floor((Math.random() * 9) + 1);
    while (board[i][j] !== 0) {
        i = Math.floor((Math.random() * 9) + 1);
        j = Math.floor((Math.random() * 9) + 1);
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
    lblTime.value = time_elapsed;
    const center = {};
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {

            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            if (board[i][j] === 2) {
                context.beginPath();

                if(movement===1){
                    context.arc(center.x, center.y, 30, (1.5+0.15) * Math.PI, (1.5+1.85) * Math.PI);//up
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x -15, center.y - 5, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "white"; //color
                    context.fill();
                }
                else if(movement===2){
                    context.arc(center.x, center.y, 30, (0.5+0.15) * Math.PI, (0.5+1.85) * Math.PI);//down
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x -15, center.y + 5, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "white"; //color
                    context.fill();
                }

                else if(movement===3){
                    context.arc(center.x, center.y, 30, (1+0.15) * Math.PI, (1+1.85) * Math.PI);//left
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "white"; //color
                    context.fill();
                }
                else if(movement===4){
                    context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI);//right
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "white"; //color
                    context.fill();
                }
                //context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle

            } else if (board[i][j] === 1) {
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                context.fillStyle = "white"; //color
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
    context.drawImage(imgGhost, center.x, center.y , 50, 50);
    center.x = ghost2[0] * 60 ;
    center.y = ghost2[1] * 60 ;
    context.drawImage(imgGhost, center.x, center.y , 50, 50);
    center.x = ghost3[0] * 60 ;
    center.y = ghost3[1] * 60 ;
    context.drawImage(imgGhost, center.x, center.y , 50, 50);
    center.x = ghost4[0] * 60 ;
    center.y = ghost4[1] * 60 ;
    context.drawImage(imgGhost, center.x, center.y , 50, 50);
    //draw candy
    if(candy[2]===1){
        center.x = candy[0] * 60 ;
        center.y = candy[1] * 60 ;
        context.drawImage(imgCandy, center.x, center.y , 50, 50);

        /**context.beginPath();
         context.arc(center.x, center.y, 20, 0, 2 * Math.PI); // circle
         context.fillStyle = "green"; //color
         context.fill();**/
    }



}

function UpdatePosition() {
    enemyC++;
    enemyC=enemyC%5;
    board[shape.i][shape.j] = 0;
    let x = GetKeyPressed();
    let collusion=0;
    if (x === 1) {
        if (shape.j > 0 && board[shape.i][shape.j - 1] !== 4) {
            shape.j--;
            movement=x;
        }
    }
    if (x === 2) {
        if (shape.j < 9 && board[shape.i][shape.j + 1] !== 4) {
            shape.j++;
            movement=x;
        }
    }
    if (x === 3) {
        if (shape.i > 0 && board[shape.i - 1][shape.j] !== 4) {
            shape.i--;
            movement=x;
        }
    }
    if (x === 4) {
        if (shape.i < 9 && board[shape.i + 1][shape.j] !== 4) {
            shape.i++;
            movement=x;
        }
    }
    if (board[shape.i][shape.j] === 1) {
        score++;
    }
    if(shape.i===candy[0]&&shape.j===candy[1]&&candy[2]!==0){
        candy[2]=0;
        score=score+50;
    }
    if(!isAlive(board)){ //post pac move
        health--;
        Draw();
        if(health>0){
            reset();
        }

    }

    board[shape.i][shape.j] = 2;


    if(enemyC===4&&isAlive(board)){//move enemy
        moveEnemy1(board);
        moveEnemy2(board);
        moveEnemy3(board);
        moveEnemy4(board);
        candyMove(board);
    }
    if(!isAlive(board)){ //post enemy move
        health--;
        Draw(board);
        if(health>0){
            reset();
        }
    }
    let currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    if (score >= 20 && time_elapsed <= 10) {
        pac_color = "green";
    }
    if (score === 100) {

        themSound.pause();
        themSound.currentTime = 0;
        winSound.play();
        window.clearInterval(interval);
        window.alert("Game completed");
    }
    else if(health<=0){
        themSound.pause();
        themSound.currentTime = 0;
        loseSound.play();
        window.clearInterval(interval);
        window.alert("Game Over! to try again press start game");
    }
    else {
        Draw();
    }
}

function reset(){
    board[shape.i][shape.j]=0
    let emptyCell=findRandomEmptyCell(board);
    board[emptyCell[0]][emptyCell[1]]=2;
    shape.i=emptyCell[0];
    shape.j=emptyCell[1];
    ghost1[0]=0;
    ghost1[1]=0;
    ghost2[0]=9;
    ghost2[1]=0;
    ghost3[0]=0;
    ghost3[1]=9;
    ghost4[0]=9;
    ghost4[1]=9;
    if(candy[2]!==0){
        candy[0]=8;
        candy[1]=8;
    }
    Draw(board);
}

function candyMove(board){
    let axis=Math.floor((Math.random() * 2) +1);
    let pos=Math.floor((Math.random() * 2) +1);
    if(axis===1){
        if(pos===1){
            if(FreeCell(candy[0]+1,candy[1])){
                candy[0]++;
            }
        }
        else if(FreeCell(candy[0]-1,candy[1])){
            candy[0]--;
        }
    }
    else {
        if(pos===1){
            if(FreeCell(candy[0],candy[1]+1)){
                candy[1]++;
            }
        }
        else if(FreeCell(candy[0],candy[1]-1)){
            candy[1]--;
        }
    }
}

function moveEnemy1(board ){
    let x=ghost1[0];
    let y=ghost1[1];
    let xDist=shape.i-x;
    let yDist=shape.j-y;

    if((xDist*xDist)>(yDist*yDist)){//xDist gratter then yDist
        if(xDist>0){
            if(FreeCell(x+1,y)){
                ghost1[0]++;
            }
            else if(yDist>0){
                if(FreeCell(x,y+1)){
                    ghost1[1]++;
                }
            }
            else if(yDist<0){
                if(FreeCell(x,y-1)){
                    ghost1[1]--;
                }
            }
        }
        else if(xDist<0){
            if(FreeCell(x-1,y)){
                ghost1[0]--;
            }
            else if(yDist>0){
                if(FreeCell(x,y+1)){
                    ghost1[1]++;
                }
            }
            else if(yDist<0){
                if(FreeCell(x,y-1)){
                    ghost1[1]--;
                }
            }
        }
    }
    else{ if(yDist>0){
        if(FreeCell(x,y+1)){
            ghost1[1]++;
        }
        else if(xDist>0){
            if(FreeCell(x+1,y)){
                ghost1[0]++;
            }
        }
        else if(xDist<0){
            if(FreeCell(x-1,y)){
                ghost1[0]--;
            }
        }
    }
    else if(yDist<0){
        if(FreeCell(x,y-1)){
            ghost1[1]--;
        }
        else if(xDist>0){
            if(FreeCell(x+1,y)){
                ghost1[0]++;
            }
        }
        else if(xDist<0){
            if(FreeCell(x-1,y)){
                ghost1[0]--;
            }
        }
    }
    }

}
function moveEnemy2(board ){
    let x=ghost2[0];
    let y=ghost2[1];
    let xDist=shape.i-x;
    let yDist=shape.j-y;

    if((xDist*xDist)>(yDist*yDist)){//xDist gratter then yDist
        if(xDist>0){
            if(FreeCell(x+1,y)){
                ghost2[0]++;
            }
            else if(yDist>0){
                if(FreeCell(x,y+1)){
                    ghost2[1]++;
                }
            }
            else if(yDist<0){
                if(FreeCell(x,y-1)){
                    ghost2[1]--;
                }
            }
        }
        else if(xDist<0){
            if(FreeCell(x-1,y)){
                ghost2[0]--;
            }
            else if(yDist>0){
                if(FreeCell(x,y+1)){
                    ghost2[1]++;
                }
            }
            else if(yDist<0){
                if(FreeCell(x,y-1)){
                    ghost2[1]--;
                }
            }
        }
    }
    else{ if(yDist>0){
        if(FreeCell(x,y+1)){
            ghost2[1]++;
        }
        else if(xDist>0){
            if(FreeCell(x+1,y)){
                ghost2[0]++;
            }
        }
        else if(xDist<0){
            if(FreeCell(x-1,y)){
                ghost2[0]--;
            }
        }
    }
    else if(yDist<0){
        if(FreeCell(x,y-1)){
            ghost2[1]--;
        }
        else if(xDist>0){
            if(FreeCell(x+1,y)){
                ghost2[0]++;
            }
        }
        else if(xDist<0){
            if(FreeCell(x-1,y)){
                ghost2[0]--;
            }
        }
    }
    }

}
function moveEnemy3(board ){
    let x=ghost3[0];
    let y=ghost3[1];
    let xDist=shape.i-x;
    let yDist=shape.j-y;

    if((xDist*xDist)>(yDist*yDist)){//xDist gratter then yDist
        if(xDist>0){
            if(FreeCell(x+1,y)){
                ghost3[0]++;
            }
            else if(yDist>0){
                if(FreeCell(x,y+1)){
                    ghost3[1]++;
                }
            }
            else if(yDist<0){
                if(FreeCell(x,y-1)){
                    ghost3[1]--;
                }
            }
        }
        else if(xDist<0){
            if(FreeCell(x-1,y)){
                ghost3[0]--;
            }
            else if(yDist>0){
                if(FreeCell(x,y+1)){
                    ghost3[1]++;
                }
            }
            else if(yDist<0){
                if(FreeCell(x,y-1)){
                    ghost3[1]--;
                }
            }
        }
    }
    else{ if(yDist>0){
        if(FreeCell(x,y+1)){
            ghost3[1]++;
        }
        else if(xDist>0){
            if(FreeCell(x+1,y)){
                ghost3[0]++;
            }
        }
        else if(xDist<0){
            if(FreeCell(x-1,y)){
                ghost3[0]--;
            }
        }
    }
    else if(yDist<0){
        if(FreeCell(x,y-1)){
            ghost3[1]--;
        }
        else if(xDist>0){
            if(FreeCell(x+1,y)){
                ghost3[0]++;
            }
        }
        else if(xDist<0){
            if(FreeCell(x-1,y)){
                ghost3[0]--;
            }
        }
    }
    }

}
function moveEnemy4(board ){
    let x=ghost4[0];
    let y=ghost4[1];
    let xDist=shape.i-x;
    let yDist=shape.j-y;

    if((xDist*xDist)>(yDist*yDist)){//xDist gratter then yDist
        if(xDist>0){
            if(FreeCell(x+1,y)){
                ghost4[0]++;
            }
            else if(yDist>0){
                if(FreeCell(x,y+1)){
                    ghost4[1]++;
                }
            }
            else if(yDist<0){
                if(FreeCell(x,y-1)){
                    ghost4[1]--;
                }
            }
        }
        else if(xDist<0){
            if(FreeCell(x-1,y)){
                ghost4[0]--;
            }
            else if(yDist>0){
                if(FreeCell(x,y+1)){
                    ghost4[1]++;
                }
            }
            else if(yDist<0){
                if(FreeCell(x,y-1)){
                    ghost4[1]--;
                }
            }
        }
    }
    else{ if(yDist>0){
        if(FreeCell(x,y+1)){
            ghost4[1]++;
        }
        else if(xDist>0){
            if(FreeCell(x+1,y)){
                ghost4[0]++;
            }
        }
        else if(xDist<0){
            if(FreeCell(x-1,y)){
                ghost4[0]--;
            }
        }
    }
    else if(yDist<0){
        if(FreeCell(x,y-1)){
            ghost4[1]--;
        }
        else if(xDist>0){
            if(FreeCell(x+1,y)){
                ghost4[0]++;
            }
        }
        else if(xDist<0){
            if(FreeCell(x-1,y)){
                ghost4[0]--;
            }
        }
    }
    }

}
function isAlive(board){
    if(shape.i===ghost1[0]&&shape.j===ghost1[1]){
        return 0;
    }
    else if(shape.i===ghost2[0]&&shape.j===ghost2[1]){
        return 0;
    }
    else if(shape.i===ghost3[0]&&shape.j===ghost3[1]){
        return 0;
    }
    else if(shape.i===ghost4[0]&&shape.j===ghost4[1]){
        return 0;
    }
    return 1;

}


function FreeCell(x,y) {
    if(x>=0&&x<10){
        if(y>=0&&y<10){
            if(board[x][y]!==4){//not obsecal
                if(ghost1[0]!==x||ghost1[1]!==y){
                    if(ghost2[0]!==x||ghost2[1]!==y){
                        if(ghost3[0]!==x||ghost3[1]!==y){
                            if(ghost4[0]!==x||ghost4[1]!==y){//not any other ghost
                                if(candy[2]===1){
                                    if(candy[0]!==x||candy[1]!==y){
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
    }
    return 0;
}

function showWelcome() {
    $("#welcome").show();
    $("#register").hide();
    $("#login").hide();
    $("#game").hide();
}

function showRegistre() {
    $("#welcome").hide();
    $("#register").show();
    $("#login").hide();
    $("#game").hide();
}

function showLogin() {
    $("#welcome").hide();
    $("#register").hide();
    $("#login").show();
    $("#game").hide();
}

function showGame() {
    $("#welcome").hide();
    $("#register").hide();
    $("#login").hide();
    $("#game").show();

    Start();
}

/** validation funcs**/
function checkPass(password)
{
    let regex = new RegExp("^[a-zA-Z0-9]+$");
    return regex.test(password);

}

function checkFirstLastName(name)
{
    let regex = new RegExp(/^[a-zA-Z()]+$/);
    return regex.test(name);
}

function isValidEmailAddress(emailAddress)
{
    let regex = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
    return regex.test(emailAddress);
}




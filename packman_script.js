let context;
let shape = {};
let board;
let score;
let pac_color;
let start_time;
let time_elapsed;
let interval;
let users = {"a": "a"};



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
    interval = setInterval(UpdatePosition, 250);
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
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const center = {};
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            if (board[i][j] === 2) {
                context.beginPath();
                context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "white"; //color
                context.fill();
            } else if (board[i][j] === 1) {
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                context.fillStyle = "white"; //color
                context.fill();
            }
            else if (board[i][j] === 4) {
                context.beginPath();
                context.rect(center.x - 30, center.y - 30, 60, 60);
                context.fillStyle = "blue"; //color
                context.fill();
            }
        }
    }


}

function UpdatePosition() {
    board[shape.i][shape.j] = 0;
    let x = GetKeyPressed();
    if (x === 1) {
        if (shape.j > 0 && board[shape.i][shape.j - 1] !== 4) {
            shape.j--;
        }
    }
    if (x === 2) {
        if (shape.j < 9 && board[shape.i][shape.j + 1] !== 4) {
            shape.j++;
        }
    }
    if (x === 3) {
        if (shape.i > 0 && board[shape.i - 1][shape.j] !== 4) {
            shape.i--;
        }
    }
    if (x === 4) {
        if (shape.i < 9 && board[shape.i + 1][shape.j] !== 4) {
            shape.i++;
        }
    }
    if (board[shape.i][shape.j] === 1) {
        score++;
    }
    board[shape.i][shape.j] = 2;
    let currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    if (score >= 20 && time_elapsed <= 10) {
        pac_color = "green";
    }
    if (score === 50) {
        window.clearInterval(interval);
        window.alert("Game completed");
    }
    else {
        Draw();
    }
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







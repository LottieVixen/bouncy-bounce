var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height/2;
var gravity = 0.098;
var dx = 0;
var dy = 0;

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    x += dx;
    if(( dy===0 || dy > 0) && (dy < 5.3 && dy >= 0)){
        dy+=gravity; //add gravity
    } else if (y >= canvas.height-10) {
        dy = -dy; //detect and bounce
    } else { //remove gravity each frame
        dy +=gravity;
    }
    console.log(dy);
    y += dy;
}

setInterval(draw, 10);
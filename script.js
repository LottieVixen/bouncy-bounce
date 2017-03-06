var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height/2;
var gravity = 0.098;
var dx = 0;
var dy = 0;
var whichIf = 0;
var stopTime = 0;
var time = 0; 
var blur = 0;
var jumpLimit = 30;
var debug = document.getElementById('cb');
var airTime = 0;
var stationaryTime = 0;
var scoreSquare = 0;
var fps = {	
    startTime : 0,	
    frameNumber : 0,	
    getFPS : function(){
        this.frameNumber++;
        var d = new Date().getTime(),
        currentTime = ( d - this.startTime ) / 1000,
        result = Math.floor( ( this.frameNumber / currentTime ) );
        if( currentTime > 1 ){
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }
        return result;
    }
};

function changeLimit(e){
    var x = e.clientX;
    var y = e.clientY;
    x -= canvas.offsetLeft;
    jumpLimit = canvas.height - y;
    //console.log(`x:${x},y:${y}`);
}
//canvas.addEventListener("click", changeLimit, false)

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        //console.log(`spacebar pressed @ ${y}`);
        if (y >= canvas.height-jumpLimit-10){
            console.log(`jump @ y:${y}`)
            if (y > canvas.height-20) {
                dy = -10.6;
            } else if (y > canvas.height-30) {
                dy = -7.95;
            } else {
                dy = -5.3;
            }
        } else {
            if ((airTime)-100 > 0){
                airTime -= 100;
            } else {
                airTime = 0;
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawJumpZone() {
    ctx.fillStyle = "#9cff96";
    ctx.fillRect(0,canvas.height-jumpLimit,canvas.width,jumpLimit);
}

function drawScoreSquare() {
    ctx.fillStyle = 'rgb(176, 235, 255)';
    //ctx.fillStyle = "purple";
    ctx.fillRect((canvas.width/2)-(airTime/40),0,airTime/20,canvas.height);
}

function draw(step) {
    var delta = (step - lastStep)/10;
    x += dx;
    if(( dy===0 || dy > 0) && (dy < 5.3 && dy >= 0)&&(y<canvas.height-10)){
        dy+= delta*gravity; //add gravity
        whichIf = 'add';
        airTime += 10;
        stationaryTime = 0;
    } else if (y >= canvas.height-10 && dy > 0) {
        dy *= -0.75; //detect and bounce
        whichIf = 'bounce';
        if (airTime > 0){
            airTime -= 10;
        } else {
            airTime = 0;
        }
        stationaryTime = 0;
    } else if (dy < 0 && y <= canvas.height-10){ //remove gravity each frame
        dy += delta*gravity;
        whichIf = 'deaccel';
        airTime += 10;
        stationaryTime = 0;
    } else if (y > canvas.height-10){
        dy = 0;
        y = 390;
        whichIf = 'accelzero';
        if (airTime > 0){
            airTime -= 10;
        } else {
            airTime = 0;
        }
        /*if (stopTime === 0) {
            stopTime = step
        } else {
            if ((step - stopTime) > 1000){
                stopTime = 0;
                dy = -5.3; //send up again
            }
        }*/
    } else {
        whichIf = 'stationary';
        if (airTime > 0){
            airTime -= 10;
        } else {
            airTime = 0;
        }
        stationaryTime += 1;
    }
    y += dy;

    //DRAW
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    /*var oldArray = ctx.getImageData(0,0,canvas.width,canvas.height);
    /count through only the alpha pixels
    for(var d=3;d<oldArray.data.length;d+=4){
    //dim it with some feedback, I'm using .9
    oldArray.data[d] = Math.floor(oldArray.data[d]*blur);
    }
    ctx.putImageData(oldArray,0,0);*/
    drawScoreSquare();
    drawJumpZone();
    drawBall();
    if (debug.checked) {
        //time = performance.now();
        ctx.fillText(`y:${y}`, 10, 10);
        ctx.fillText(`dy:${dy}`, 10, 20);
        ctx.fillText(`whichIf:${whichIf}`, 10, 30);
        ctx.fillText(`jumpLimit:${jumpLimit}`,10,40);
        //ctx.fillText(`time:${Math.round(time)}`, 10, 40);
        ctx.fillText(`fps:${fps.getFPS()}`,10,50);
    }
    ctx.fillText(`airTime:${airTime}`,10,60);
    ctx.fillText(`stationaryTime:${stationaryTime}`,10,70);

    lastStep = step;
    requestAnimationFrame(draw);
}

lastStep = performance.now();
requestAnimationFrame(draw);
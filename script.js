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
canvas.addEventListener("click", changeLimit, false)

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        //console.log(`spacebar pressed @ ${y}`);
        if (y >= canvas.height-jumpLimit){
            dy = -5.3;
            //console.log("jump")
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
    ctx.fillStyle = "#9cff96"
    ctx.fillRect(0,canvas.height-jumpLimit,canvas.width,jumpLimit);
}

function draw(step) {
    var delta = (step - lastStep)/10;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    /*var oldArray = ctx.getImageData(0,0,canvas.width,canvas.height);
/   /count through only the alpha pixels
    for(var d=3;d<oldArray.data.length;d+=4){
    //dim it with some feedback, I'm using .9
    oldArray.data[d] = Math.floor(oldArray.data[d]*blur);
    }
    ctx.putImageData(oldArray,0,0);*/
    drawJumpZone();
    drawBall();
    x += dx;
    if(( dy===0 || dy > 0) && (dy < 5.3 && dy >= 0)&&(y<canvas.height-10)){
        dy+= delta*gravity; //add gravity
        whichIf = 'add';
    } else if (y >= canvas.height-10 && dy > 0) {
        dy *= -0.75; //detect and bounce
        whichIf = 'bounce';
    } else if (dy < 0 && y <= canvas.height-10){ //remove gravity each frame
        dy += delta*gravity;
        whichIf = 'deaccel';
    } else if (y > canvas.height-10){
        dy = 0;
        y = 390;
        whichIf = 'accelzero';
        /*if (stopTime === 0) {
            stopTime = step
        } else {
            if ((step - stopTime) > 1000){
                stopTime = 0;
                dy = -5.3; //send up again
            }
        }*/
    }
    y += dy;
    if (debug.checked) {
        //time = performance.now();
        ctx.fillText(`y:${y}`, 10, 10);
        ctx.fillText(`dy:${dy}`, 10, 20);
        ctx.fillText(`whichIf:${whichIf}`, 10, 30);
        ctx.fillText(`jumpLimit:${jumpLimit}`,10,40);
        //ctx.fillText(`time:${Math.round(time)}`, 10, 40);
        ctx.fillText(`fps:${fps.getFPS()}`,10,50);
    }
     lastStep = step;
     requestAnimationFrame(draw);
}

lastStep = performance.now();
requestAnimationFrame(draw);
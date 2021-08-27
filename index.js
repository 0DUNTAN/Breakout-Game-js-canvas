const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); 

//lose functionalities
const loseCon = document.getElementById('lose-container');
const startBtn = document.getElementById('start-btn');
const disScore = document.getElementById('score');

let score = 0;

const brickRowCount = 13;
const brickColumnCount = 6;

//create ball props
const ball = {
    x: canvas.width / 2,
    y: (canvas.height / 8) * 7,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
};

//create paddle props
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0,
};

//Create brick props
const brickInfo = {
    w: 50,
    h: 30,
    padding: 7,
    offsetX: 35,
    offsetY: 60,
    visible: true    
};

//Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = {x, y, ...brickInfo };
    } 
}


//Draw ball on canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}    

//Draw Paddle on canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}


//Draw score on Canvas 
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

//Draw bricks on Canvas
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#272d3f' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
}

//Move paddle
function movePaddle() {
    paddle.x += paddle.dx; 

    //Wall detection
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;   
    }

    if (paddle.x < 0 ) {
        paddle.x = 0;
    }
}

//Move Ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    //Wall collision{right/left}
    if (ball.x + ball.size > canvas.width || ball.x - ball.size  < 0) {
         ball.dx *= -1;
    } 
    
    //Wall collision{top/bottom}
    if (ball.y + ball.size > canvas.height || ball.y - ball.size  < 0) {
        ball.dy *= -1;
    } 

    //Paddle collision
    if (
        ball.x - ball.size > paddle.x 
        && ball.x + ball.size < paddle.x + paddle.w 
        && ball.y + ball.size > paddle.y
    ) { 
        ball.dy = -ball.speed;
    }

    //Brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (ball.x - ball.size > brick.x && //left Brick side Check
                    ball.x + ball.size < brick.x + brick.w && //Right brick side check
                    ball.y + ball.size > brick.y && //top brick sidecheck
                    ball.y - ball.size < brick.y + brick.h // bottom brick side check
                ) {
                    ball.dy *= -1;
                    brick.visible = false;

                    increaseScore();
                }
            }
        });
    });

    //Hit bottom wall - lose
    if (ball.y + ball.size > canvas.height) {
        showAllBricks();
        loseGame();
        score = 0;
    }
}


//Increase Score
function increaseScore() {
    score++;
    if (score % (brickRowCount * brickColumnCount) === 0) {
        showAllBricks();
        loseCon.style.display = 'flex';
    }
}

//Make all Bricks appear
function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => brick.visible = true)
    });
}

//Draw canvas element 
function draw() {
    //Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawScore(); 
    drawBricks();
}

//Update canvas  drawing and animation 
function update() {
    movePaddle();
    moveBall();

    //Draw all canvas element
    draw();

    requestAnimationFrame(update);
}

//update();

//Keyboard event
//keycown event
function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
} 

function loseGame() {
    loseCon.classList.add('show');
    disScore.innerText = `${score}`;
}

function startNewGame() {
    showAllBricks();
    score = 0;
    loseCon.classList.remove('show'); 

   // let ball.x = canvas.width / 2;
   // let ball.y = (canvas.height / 8) * 7;
    
    drawBall();
}

//keyUp event
function keyUp(e) {
    if (
        e.key === 'Right' || 
        e.key === 'ArrowRight'|| 
        e.key === 'Left' || 
        e.key === 'ArrowLeft'
    ) {
        paddle.dx = 0;
    } else {
        
    }
}
const timerCon = document.getElementById('timer-container');
//const  timer = document.getElementById('timer')

//showCountdown Before Game
//function startGame() {
    setTimeout(() => {
    timerCon.style.display = 'none';

    canvas.style.display = 'flex';
    update();
}, 3000);
//}


//event listener
//Keyboard Event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

//Rules and close event listener
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
startBtn.addEventListener('click', startNewGame);
//window.addEventListener('click', startGame);
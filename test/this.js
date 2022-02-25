canvas = document.getElementById("canvas");
const ROWS = COLS = 36; //MAP SIZE
const CELL_WIDTH = 25, CANVAS_WIDTH = CANVAS_HEIGHT = ROWS*CELL_WIDTH;

canvas.setAttribute("width", CANVAS_WIDTH);
canvas.setAttribute("height", CANVAS_HEIGHT);
var ctx = canvas.getContext("2d");

let colors = ["#ff0000", "#00ff00", "#0000ff"];
let players = 3;
let playerLifes = new Array(players).fill(0);

/////// FPS
var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;
const FPS = 60; 

function createMatrix () {
    let matrix = new Array(ROWS);
    for(let i = 0; i < ROWS; i++)
    {
        matrix[i] = new Array(COLS);
        for(let j = 0; j < COLS; j++)
        {
            if(Math.random() < 0.5) //50% eséllyel élő cella, egyenlő eséllyel adott színű
            {
                //let r = Math.floor(Math.random() * players) + 1;
                //matrix[i][j] = r;
                //playerLifes[r-1]++;
                matrix[i][j] = 1;
            }
            else matrix[i][j] = 0;
        }
    }
    return matrix;
}

function draw (grid) {

    requestAnimationFrame(function(){
        draw(grid);
});

    // calc elapsed time since last loop

    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        // Put your drawing code here
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  let y = 0
  for (let row of grid) {
      let x = 0
      for (let col of row) {
          ctx.beginPath()
          ctx.rect(x, y, CELL_WIDTH, CELL_WIDTH);
          if (col) {
              ctx.fillStyle = colors[col-1];
              ctx.fill()
          }
          ctx.stroke();
          x += CELL_WIDTH
      }
      y += CELL_WIDTH
  }

  let next = createMatrix();

  // Compute next based on grid
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      let state = grid[i][j] > 0 ? 1 : 0;
      // Count live neighbors!
      let neighbors = countNeighbors(grid, i, j);

      if (state == 0 && neighbors == 3) {
        //next[i][j] = Math.floor(Math.random() * players) + 1;
        next[i][j] = 1;
      } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = 0;
      } else {
        next[i][j] = state;
      }
    }
  }

    grid = next;
    }   
}

function countNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let col = (x + i + COLS) % COLS;
        let row = (y + j + ROWS) % ROWS;
        sum += grid[col][row];
      }
    }
    sum -= grid[x][y];
    return sum;
  }

var grid = createMatrix();
log();
startAnimating(grid);

/////// FPS

// initialize the timer variables and start the animation

function startAnimating(grid) {
    fpsInterval = 1000 / FPS;
    then = Date.now();
    startTime = then;
    draw(grid);
}

function log()
{
    console.log(grid);
    let jsongrid = JSON.stringify(grid);
    console.log(jsongrid);
    let gridjson = JSON.parse(jsongrid);
    console.log(gridjson);
}
///////
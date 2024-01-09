const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 840;
canvas.height = 930;

let columns = 28;
let rows = 31;

let level = 1;

//Wall is 0, dot is 1, big dot is 2, blank is 3
let mapTiles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,
    0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0,
    0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0,
    0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 3, 3, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 3, 3, 3, 3, 3, 3, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3,
    0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 3, 3, 3, 3, 3, 3, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,
    0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,
    0, 2, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 2, 0,
    0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0,
    0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
    0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

let grid = [];
function createGrid() {
    let mapSpace = 0;
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < columns; j++) {
            switch (mapTiles[mapSpace]) {
                case 0:
                    grid[i][j] = new GridSpace({
                        position: {
                            x: j * (canvas.width / columns),
                            y: i * (canvas.height / rows),
                        },
                        width: canvas.width / columns,
                        height: canvas.height / rows,
                        index: {
                            row: i,
                            column: j,
                        },
                        wall: true,
                    });
                    break;
                case 1:
                    grid[i][j] = new GridSpace({
                        position: {
                            x: j * (canvas.width / columns),
                            y: i * (canvas.height / rows),
                        },
                        width: canvas.width / columns,
                        height: canvas.height / rows,
                        index: {
                            row: i,
                            column: j,
                        },
                        contents: 'dot'
                    });
                    //Also puch a new dot to dots array
                    break;
                case 2:
                    grid[i][j] = new GridSpace({
                        position: {
                            x: j * (canvas.width / columns),
                            y: i * (canvas.height / rows),
                        },
                        width: canvas.width / columns,
                        height: canvas.height / rows,
                        index: {
                            row: i,
                            column: j,
                        },
                        contents: 'bigDot'
                    });
                    break;
                case 3:
                    grid[i][j] = new GridSpace({
                        position: {
                            x: j * (canvas.width / columns),
                            y: i * (canvas.height / rows),
                        },
                        width: canvas.width / columns,
                        height: canvas.height / rows,
                        index: {
                            row: i,
                            column: j,
                        }
                    });
                    break;
            }
            mapSpace++;
        }
    }
}

let player;
let ghosts = [];
function createSprites() {
    player = new Player({
        position: {
            x: grid[23][14].position.x + (grid[23][14].width / 2),
            y: grid[23][14].position.y + (grid[23][14].height / 2),
        },
        radius: ((canvas.width / columns) * 0.4),
        currentTile: grid[23][14]
    })
    ghosts[0] = new Blinky({
        position: {
            x: grid[14][13].position.x + (grid[14][13].width / 2),
            y: grid[14][13].position.y + (grid[14][13].height / 2),
        },
        radius: ((canvas.width / columns) * 0.4),
        currentTile: grid[14][13]
    })
    ghosts[1] = new Pinky({
        position: {
            x: grid[14][14].position.x + (grid[14][14].width / 2),
            y: grid[14][14].position.y + (grid[14][14].height / 2),
        },
        radius: ((canvas.width / columns) * 0.4),
        currentTile: grid[14][14]
    })
    ghosts[2] = new Clyde({
        position: {
            x: grid[14][15].position.x + (grid[14][15].width / 2),
            y: grid[14][15].position.y + (grid[14][15].height / 2),
        },
        radius: ((canvas.width / columns) * 0.4),
        currentTile: grid[14][15]
    })
    ghosts[3] = new Inky({
        position: {
            x: grid[14][16].position.x + (grid[14][16].width / 2),
            y: grid[14][16].position.y + (grid[14][16].height / 2),
        },
        radius: ((canvas.width / columns) * 0.4),
        currentTile: grid[14][16]
    })

}

const startGameWrapper = document.querySelector('#start-game-wrapper');
const livesWrapper = document.querySelector('#lives-wrapper');
const endGameWrapper = document.querySelector('#end-game-wrapper');

function startGame() {
    createGrid();
    createSprites();
    animate();
    startGameWrapper.style.visibility = 'hidden';
}

function restartGame() {
    createGrid();
    createSprites();
    toggleVisible(endGameWrapper);
}

function loadNextLevel(currentLevel) {
    createGrid();
    createSprites();
    for(let ghost of ghosts) {
        ghost.speed += (currentLevel * 0.1);
    }
    level += 1;
}

function toggleVisible(elementToToggle) {
    elementToToggle.classList.toggle('visible');
}

function respawnAllSprites() {
    player.position.x = grid[23][14].position.x + (grid[23][14].width / 2);
    player.position.y = grid[23][14].position.y + (grid[23][14].height / 2);
    player.currentTile = grid[23][14];
    ghosts[0].position.x = grid[14][13].position.x + (grid[14][13].width / 2);
    ghosts[0].position.y = grid[14][13].position.y + (grid[14][13].height / 2);
    ghosts[0].currentTile = grid[14][13];
    ghosts[1].position.x = grid[14][14].position.x + (grid[14][14].width / 2);
    ghosts[1].position.y = grid[14][14].position.y + (grid[14][14].height / 2);
    ghosts[1].currentTile = grid[14][14];
    ghosts[2].position.x = grid[14][15].position.x + (grid[14][15].width / 2);
    ghosts[2].position.y = grid[14][15].position.y + (grid[14][15].height / 2);
    ghosts[2].currentTile = grid[14][15];
    ghosts[3].position.x = grid[14][16].position.x + (grid[14][16].width / 2);
    ghosts[3].position.y = grid[14][16].position.y + (grid[14][16].height / 2);
    ghosts[3].currentTile = grid[14][16];
    player.respawning = true;
    player.lives--;
    if(player.live > 1)livesWrapper.innerHTML = `${player.lives} lives left!`;
    else livesWrapper.innerHTML = `${player.lives} life left!`;
    toggleVisible(livesWrapper);
    setTimeout(() => {
        toggleVisible(livesWrapper);
        player.respawning = false;
    }, 3000)
}

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            grid[i][j].update();
        }
    }
    if (player.alive && !player.respawning) {
        player.update();
        for (let i = 0; i < ghosts.length; i++) {
            ghosts[i].update();
        }
    }
}
window.setInterval(() => {
    for(let ghost of ghosts) {
        if(ghost.mode === 'chasing') ghost.mode = 'scatter';
        else if(ghost.mode === 'scatter') ghost.mode = 'chasing';
        console.log(ghost.mode);
    }
}, 10000)
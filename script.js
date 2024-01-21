const canvas = document.querySelector('canvas');
const playerLivesDisplay = document.querySelector('#player-lives-display');
const displayWrappers = document.querySelectorAll('.display-wrapper');
const c = canvas.getContext('2d');

function firstDivisible(number, divisor) {
    let remainder = number % divisor;
    if (remainder == 0) {
        return number;
    }
    else {
        return number - remainder;
    }
}

let columns = 28;
let rows = 31;

canvas.height = firstDivisible(window.innerHeight - 100, rows); //Was 930
let scaleFactor = canvas.height / rows;
canvas.width = columns * scaleFactor; //Was 840
displayWrappers.forEach((display) => {
    display.style.width = `${canvas.width}px`;
})

let ghostSpeed = 1;
let level = 1;
let score = 0;

const highScoreWrapper = document.querySelector('#high-score-wrapper');
const scoreWrapper = document.querySelector('#score-wrapper');
if(localStorage.getItem('highScore')) highScoreWrapper.innerHTML = `High-Score: ${localStorage.getItem('highScore')}`;
else {
    localStorage.setItem('highScore', 0);
    highScoreWrapper.innerHTML = `High-Score: 0`;
} 

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
        radius: ((canvas.width / columns) * 0.5),
        currentTile: grid[23][14],
        animations: {
            moveLeft: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 1,
                rows: 10,
                columns: 14
            },
            moveRight: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 0,
                rows: 10,
                columns: 14
            },
            moveUp: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 2,
                rows: 10,
                columns: 14
            },
            moveDown: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 3,
                rows: 10,
                columns: 14
            },
        }
    })
    ghosts[0] = new Blinky({
        position: {
            x: grid[14][13].position.x + (grid[14][13].width / 2),
            y: grid[14][13].position.y + (grid[14][13].height / 2),
        },
        radius: ((canvas.width / columns) * 0.5),
        currentTile: grid[14][13],
        animations: {
            moveLeft: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 4,
                rows: 10,
                column: 2,
                columns: 14
            },
            moveRight: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 4,
                rows: 10,
                column: 0,
                columns: 14
            },
            moveUp: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 4,
                rows: 10,
                column: 4,
                columns: 14
            },
            moveDown: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 4,
                rows: 10,
                column: 6,
                columns: 14
            },
            flee: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 4,
                rows: 10,
                column: 8,
                columns: 14
            },
            respawnLeft: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 9,
                columns: 14
            },
            respawnRight: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 8,
                columns: 14
            },
            respawnUp: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 10,
                columns: 14
            },
            respawnDown: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 11,
                columns: 14
            }
        }
        
    })
    ghosts[1] = new Pinky({
        position: {
            x: grid[14][14].position.x + (grid[14][14].width / 2),
            y: grid[14][14].position.y + (grid[14][14].height / 2),
        },
        radius: ((canvas.width / columns) * 0.5),
        currentTile: grid[14][14],
        animations: {
            moveLeft: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 2,
                columns: 14
            },
            moveRight: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 0,
                columns: 14
            },
            moveUp: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 4,
                columns: 14
            },
            moveDown: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 6,
                columns: 14
            },
            flee: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 4,
                rows: 10,
                column: 8,
                columns: 14
            },
            respawnLeft: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 9,
                columns: 14
            },
            respawnRight: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 8,
                columns: 14
            },
            respawnUp: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 10,
                columns: 14
            },
            respawnDown: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 11,
                columns: 14
            }
        }
    })
    ghosts[2] = new Clyde({
        position: {
            x: grid[14][15].position.x + (grid[14][15].width / 2),
            y: grid[14][15].position.y + (grid[14][15].height / 2),
        },
        radius: ((canvas.width / columns) * 0.5),
        currentTile: grid[14][15],
        animations: {
            moveLeft: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 7,
                rows: 10,
                column: 2,
                columns: 14
            },
            moveRight: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 7,
                rows: 10,
                column: 0,
                columns: 14
            },
            moveUp: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 7,
                rows: 10,
                column: 4,
                columns: 14
            },
            moveDown: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 7,
                rows: 10,
                column: 6,
                columns: 14
            },
            flee: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 4,
                rows: 10,
                column: 8,
                columns: 14
            },
            respawnLeft: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 9,
                columns: 14
            },
            respawnRight: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 8,
                columns: 14
            },
            respawnUp: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 10,
                columns: 14
            },
            respawnDown: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 11,
                columns: 14
            }
        }
    })
    ghosts[3] = new Inky({
        position: {
            x: grid[14][16].position.x + (grid[14][16].width / 2),
            y: grid[14][16].position.y + (grid[14][16].height / 2),
        },
        radius: ((canvas.width / columns) * 0.5),
        currentTile: grid[14][16],
        animations: {
            moveLeft: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 6,
                rows: 10,
                column: 2,
                columns: 14
            },
            moveRight: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 6,
                rows: 10,
                column: 0,
                columns: 14
            },
            moveUp: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 6,
                rows: 10,
                column: 4,
                columns: 14
            },
            moveDown: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 6,
                rows: 10,
                column: 6,
                columns: 14
            },
            flee: {
                imageSrc: './img/spritesheet.png',
                frameCount: 2,
                frameRate: 5,
                row: 4,
                rows: 10,
                column: 8,
                columns: 14
            },
            respawnLeft: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 9,
                columns: 14
            },
            respawnRight: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 8,
                columns: 14
            },
            respawnUp: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 10,
                columns: 14
            },
            respawnDown: {
                imageSrc: './img/spritesheet.png',
                frameCount: 1,
                frameRate: 5,
                row: 5,
                rows: 10,
                column: 11,
                columns: 14
            }
        }
    })

}

const startGameWrapper = document.querySelector('#start-game-wrapper');
const livesWrapper = document.querySelector('#lives-wrapper');
const levelWrapper = document.querySelector('#level-wrapper');
const endGameWrapper = document.querySelector('#end-game-wrapper');

function startGame() {
    createGrid();
    createSprites();
    animate();
    startGameWrapper.style.visibility = 'hidden';
    displayWrappers.forEach((display) => {
        display.style.visibility = 'visible';
    })
    levelWrapper.innerText = `Level ${level}`;
    player.respawning = true;
    toggleVisible(levelWrapper);
    setTimeout(() => {
        toggleVisible(levelWrapper);
        player.respawning = false;
    }, 3000);
}

function restartGame() {
    createGrid();
    createSprites();
    toggleVisible(endGameWrapper);
    level = 1;
    score = 0;
    playerLivesDisplay.innerHTML = '';
    for(let i = 0; i < player.lives; i++) {
        let playerLife = document.createElement('div');
        playerLife.classList.add('player-life');
        playerLivesDisplay.appendChild(playerLife);
    }
    levelWrapper.innerText = `Level ${level}`;
    player.respawning = true;
    toggleVisible(levelWrapper);
    setTimeout(() => {
        toggleVisible(levelWrapper);
        player.respawning = false;
    }, 3000);
}

function loadNextLevel() {
    let playerLifeCount = player.lives;
    createGrid();
    createSprites();
    levelWrapper.innerText = `Level ${level + 1}`;
    player.respawning = true;
    toggleVisible(levelWrapper);
    setTimeout(() => {
        toggleVisible(levelWrapper);
        player.respawning = false;
    }, 3000);
    player.lives = playerLifeCount;
    ghostSpeed += (level * 0.1);
    for (let ghost of ghosts) {
        ghost.speed = ghostSpeed;
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
    playerLivesDisplay.innerHTML = '';
    for(let i = 0; i < player.lives; i++) {
        let playerLife = document.createElement('div');
        playerLife.classList.add('player-life');
        playerLivesDisplay.appendChild(playerLife);
    }
    if (player.lives > 1) livesWrapper.innerHTML = `${player.lives} lives left!`;
    else livesWrapper.innerHTML = `${player.lives} life left!`;
    toggleVisible(livesWrapper);
    setTimeout(() => {
        toggleVisible(livesWrapper);
        player.respawning = false;
    }, 3000)
}

function updateScore() {
    scoreWrapper.innerHTML = `Score: ${score}`
    if(score > JSON.parse(localStorage.getItem('highScore'))) {
        localStorage.setItem('highScore', score);
        highScoreWrapper.innerHTML = `High-Score: ${score}`;
    } 
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
        updateScore();
    }
}
window.setInterval(() => {
    for (let ghost of ghosts) {
        if (ghost.mode === 'chasing') ghost.mode = 'scatter';
        else if (ghost.mode === 'scatter') ghost.mode = 'chasing';
    }
}, 30000)
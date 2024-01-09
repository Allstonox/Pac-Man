class Player {
    constructor({ position, radius, currentTile }) {
        this.position = position;
        this.radius = radius;
        this.controls = new Controls();
        this.currentTile = currentTile;
        this.alive = true;
        this.lives = 2;
        this.respawning = false;
    }

    update() {
        this.show();
        this.move();
        this.tryEat();
        if(this.checkFull()) loadNextLevel(level);
        this.checkCollision();
    }

    show() {
        c.fillStyle = 'rgb(230, 230, 0)';
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        c.fill();
    }

    move() {
        this.updateCurrentTile();
        if (this.checkDirectionAvailable(this.controls.queuedDirection)) this.controls.direction = this.controls.queuedDirection;

        if (this.controls.direction === 'left' && this.checkDirectionAvailable(this.controls.direction)) {
            this.position.x--;
            this.position.y = this.currentTile.position.y + (this.currentTile.height / 2);
        }
        else if (this.controls.direction === 'right' && this.checkDirectionAvailable(this.controls.direction)) {
            this.position.x++;
            this.position.y = this.currentTile.position.y + (this.currentTile.height / 2);
        }
        else if (this.controls.direction === 'down' && this.checkDirectionAvailable(this.controls.direction)) {
            this.position.y++;
            this.position.x = this.currentTile.position.x + (this.currentTile.width / 2);
        }
        else if (this.controls.direction === 'up' && this.checkDirectionAvailable(this.controls.direction)) {
            this.position.y--;
            this.position.x = this.currentTile.position.x + (this.currentTile.width / 2);
        }
    }

    updateCurrentTile() {
        //Offscreen left
        if (this.position.x < 0 + (this.currentTile.width / 2) && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
            this.currentTile = grid[14][27];
            this.position.x = this.currentTile.position.x;
            return;
        }
        //Offscreen right
        if (this.position.x > canvas.width - (this.currentTile.width / 2) && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
            this.currentTile = grid[14][0];
            this.position.x = this.currentTile.position.x + (this.currentTile.width / 2);
            return;
        }
        //Left
        if (this.position.x < this.currentTile.position.x - (this.currentTile.width / 2) && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
            this.currentTile = grid[this.currentTile.index.row][this.currentTile.index.column - 1];
        }
        //Right
        else if (this.position.x > this.currentTile.position.x + this.currentTile.width + (this.currentTile.width / 2) && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
            this.currentTile = grid[this.currentTile.index.row][this.currentTile.index.column + 1];
        }
        //Down
        else if (this.position.y > this.currentTile.position.y + this.currentTile.height + (this.currentTile.height / 2) && this.position.x > this.currentTile.position.x && this.position.x < this.currentTile.position.x + this.currentTile.width) {
            this.currentTile = grid[this.currentTile.index.row + 1][this.currentTile.index.column];
        }
        //Up
        else if (this.position.y < this.currentTile.position.y - (this.currentTile.height / 2) && this.position.x > this.currentTile.position.x && this.position.x < this.currentTile.position.x + this.currentTile.width) {
            this.currentTile = grid[this.currentTile.index.row - 1][this.currentTile.index.column];
        }
    }

    checkDirectionAvailable(directionToCheck) {
        if (directionToCheck === 'left') {
            if (this.currentTile.index.column > 0 && grid[this.currentTile.index.row][this.currentTile.index.column - 1].wall) return false;
            return true;
        }
        else if (directionToCheck === 'right') {
            if (this.currentTile.index.column < columns - 1 && grid[this.currentTile.index.row][this.currentTile.index.column + 1].wall) return false;
            return true;
        }
        else if (directionToCheck === 'down') {
            if (this.currentTile.index.row < rows - 1 && grid[this.currentTile.index.row + 1][this.currentTile.index.column].wall) return false;
            return true;
        }
        else if (directionToCheck === 'up') {
            if (this.currentTile.index.row > 0 && grid[this.currentTile.index.row - 1][this.currentTile.index.column].wall) return false;
            return true;
        }
    }

    tryEat() {
        if (this.currentTile.contents === 'dot') {
            this.currentTile.contents = null;
        }
        else if (this.currentTile.contents === 'bigDot') {
            this.currentTile.contents = null;
        }
    }

    checkFull() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if(grid[i][j].contents != null) return false;
            }
        }
        return true;
    }

    checkCollision() {
        for(let ghost of ghosts) {
            if (this.currentTile === ghost.currentTile) {
                if (this.lives > 1) respawnAllSprites();
                else {
                    this.alive = false;
                    toggleVisible(endGameWrapper);
                }
            }
        }
    }
}
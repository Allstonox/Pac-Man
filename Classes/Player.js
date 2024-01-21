class Player {
    constructor({ position, radius, currentTile, animations, speed = 2 }) {
        this.position = position;
        this.radius = radius;
        this.controls = new Controls();
        this.currentTile = currentTile;
        this.animations = animations;
        this.image = new Image();
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
        }
        for (let key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;
            this.animations[key].image = image;
        }
        this.image.src = this.animations.moveLeft.imageSrc;
        this.currentAnimation = this.animations.moveLeft;
        this.currentFrame = 0;
        this.frameBuffer = 1;
        this.speed = speed;
        this.alive = true;
        this.lives = 3;
        this.respawning = false;
    }

    update() {
        this.show();
        this.move();
        this.tryEat();
        if (this.checkFull()) loadNextLevel();
        this.checkCollision();
    }

    show() {
        // c.fillStyle = 'rgb(230, 230, 0)';
        // c.beginPath();
        // c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        // c.fill();

        if (!this.image) return;
        c.drawImage(this.image,
            this.currentFrame * (this.image.width / this.currentAnimation.columns) + 2, //Add 2 because spritesheet isn't properly aligned
            this.currentAnimation.row * (this.image.height / this.currentAnimation.rows),
            (this.image.width / this.currentAnimation.columns),
            (this.image.height / this.currentAnimation.rows),
            this.position.x - this.radius, this.position.y - this.radius, this.radius * 2, this.radius * 2);
        if (this.frameBuffer % this.currentAnimation.frameRate === 0) {
            if (this.currentFrame < this.currentAnimation.frameCount - 1) this.currentFrame++;
            else this.currentFrame = 0;
            this.frameBuffer = 1;
        }
        else this.frameBuffer++;
    }

    switchSprite(direction) {
        this.currentFrame = 0;
        this.frameBuffer = 1;
        switch (direction) {
            case 'left':
                this.currentAnimation = this.animations.moveLeft;
                this.image = this.animations.moveLeft.image;
                break;
            case 'right':
                this.currentAnimation = this.animations.moveRight;
                this.image = this.animations.moveRight.image;
                break;
            case 'up':
                this.currentAnimation = this.animations.moveUp;
                this.image = this.animations.moveUp.image;
                break;
            case 'down':
                this.currentAnimation = this.animations.moveDown;
                this.image = this.animations.moveDown.image;
                break;
        }
    }

    move() {
        this.updateCurrentTile();
        if (this.controls.queuedDirection != this.controls.direction && this.checkDirectionAvailable(this.controls.queuedDirection)) {
            this.controls.direction = this.controls.queuedDirection;
            this.switchSprite(this.controls.direction);
        } 

        if (this.controls.direction === 'left' && this.checkDirectionAvailable(this.controls.direction)) {
            this.position.x -= this.speed;
            this.position.y = this.currentTile.position.y + (this.currentTile.height / 2);
        }
        else if (this.controls.direction === 'right' && this.checkDirectionAvailable(this.controls.direction)) {
            this.position.x += this.speed;
            this.position.y = this.currentTile.position.y + (this.currentTile.height / 2);
        }
        else if (this.controls.direction === 'down' && this.checkDirectionAvailable(this.controls.direction)) {
            this.position.y += this.speed;
            this.position.x = this.currentTile.position.x + (this.currentTile.width / 2);
        }
        else if (this.controls.direction === 'up' && this.checkDirectionAvailable(this.controls.direction)) {
            this.position.y -= this.speed;
            this.position.x = this.currentTile.position.x + (this.currentTile.width / 2);
        }
        else {
            this.position.x = this.currentTile.position.x + (this.currentTile.width / 2);
            this.position.y = this.currentTile.position.y + (this.currentTile.height / 2);
        }
    }

    updateCurrentTile() {
        //Offscreen left
        if (this.position.x < 0 + (this.currentTile.width / 2) && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
            this.currentTile = grid[14][27];
            this.position.x = this.currentTile.position.x + (this.currentTile.width * 0.5);
            return;
        }
        //Offscreen right
        else if (this.position.x > canvas.width - (this.currentTile.width / 2) && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
            this.currentTile = grid[14][0];
            this.position.x = this.currentTile.position.x + (this.currentTile.width * 0.5);
            return;
        }
        //Left
        else if (this.position.x < this.currentTile.position.x - (this.currentTile.width / 2) && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
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
            score += 10;
            this.currentTile.contents = null;
        }
        else if (this.currentTile.contents === 'bigDot') {
            this.currentTile.contents = null;
            score += 50;
            for (let ghost of ghosts) {
                if(ghost.mode != 'respawning') {
                    ghost.mode = 'fleeing';
                    ghost.switchSprite(ghost.direction);
                    ghost.speed = 0.4;
                    ghost.turningAround = true;
                    ghost.turningTile = ghost.currentTile;
                    ghost.fleeingStart = performance.now();
                }
                // if (ghost.direction === 'left') ghost.queuedDirection = 'right';
                // else if (ghost.direction === 'right') ghost.queuedDirection = 'left';
                // else if (ghost.direction === 'up') ghost.queuedDirection = 'down';
                // else if (ghost.direction === 'down') ghost.queuedDirection = 'up';
            }
        }
    }

    checkFull() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (grid[i][j].contents != null) return false;
            }
        }
        return true;
    }

    checkCollision() {
        for (let ghost of ghosts) {
            if (ghost.position.x > this.position.x - this.radius && ghost.position.x < this.position.x + this.radius && ghost.position.y > this.position.y - this.radius && ghost.position.y < this.position.y + this.radius) {
                if (ghost.mode === 'fleeing') {
                    ghost.speed = 2;
                    ghost.mode = 'respawning';
                    ghost.switchSprite(ghost.direction);
                }
                else if (ghost.mode != 'respawning') {
                    if (this.lives > 1) respawnAllSprites();
                    else {
                        this.alive = false;
                        toggleVisible(endGameWrapper);
                    }
                }
            }
        }
    }
}
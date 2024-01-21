class Ghost {
    constructor({ position, radius, currentTile, animations, color, speed = 1, mode = 'scatter', direction = 'up' }) {
        this.position = position;
        this.radius = radius;
        this.pathfinder = new Pathfinder(this);
        this.currentTile = currentTile;
        this.startingTile = currentTile;
        this.lastTile = currentTile;
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
        this.color = color;
        this.speed = speed;
        this.mode = mode;
        this.direction = direction;
        this.queuedDirection;
        this.currentPath;
        this.lastPos = this.position;
        this.scatterTile;
        this.fleeingStart;
        this.turningAround;
        this.turningTile;
    }

    show() {
        // if (this.mode === 'fleeing') {
        //     c.fillStyle = `rgb(0, 0, 255)`;
        //     c.beginPath();
        //     c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        //     c.fill();
        // }
        // if (this.mode === 'respawning') {
        //     c.fillStyle = `rgb(255, 255, 255)`;
        //     c.beginPath();
        //     c.arc(this.position.x - 5, this.position.y, this.radius / 2, 0, 2 * Math.PI);
        //     c.fill();
        //     c.beginPath();
        //     c.arc(this.position.x + 5, this.position.y, this.radius / 2, 0, 2 * Math.PI);
        //     c.fill();
        //     c.fillStyle = `rgb(0, 0, 0)`;
        //     c.beginPath();
        //     c.arc(this.position.x - 5, this.position.y, this.radius / 3, 0, 2 * Math.PI);
        //     c.fill();
        //     c.beginPath();
        //     c.arc(this.position.x + 5, this.position.y, this.radius / 3, 0, 2 * Math.PI);
        //     c.fill();
        // }
        // c.fillStyle = `rgb(${this.color.red}, ${this.color.green}, ${this.color.blue})`;
        // c.beginPath();
        // c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        // c.fill();

        if (!this.image) return;
        c.drawImage(this.image,
            (this.currentAnimation.column * (this.image.width / this.currentAnimation.columns)) + this.currentFrame * (this.image.width / this.currentAnimation.columns) + 2, //Add 2 because spritesheet isn't properly aligned
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
                if (this.mode != 'fleeing' && this.mode != 'respawning') {
                    this.currentAnimation = this.animations.moveLeft;
                    this.image = this.animations.moveLeft.image;
                }
                else if (this.mode === 'respawning') {
                    this.currentAnimation = this.animations.respawnLeft;
                    this.image = this.animations.respawnLeft.image;
                }
                else {
                    this.currentAnimation = this.animations.flee;
                    this.image = this.animations.flee.image;
                }
                break;
            case 'right':
                if (this.mode != 'fleeing' && this.mode != 'respawning') {
                    this.currentAnimation = this.animations.moveRight;
                    this.image = this.animations.moveRight.image;
                }
                else if (this.mode === 'respawning') {
                    this.currentAnimation = this.animations.respawnRight;
                    this.image = this.animations.respawnRight.image;
                }
                else {
                    this.currentAnimation = this.animations.flee;
                    this.image = this.animations.flee.image;
                }
                break;
            case 'up':
                if (this.mode != 'fleeing' && this.mode != 'respawning') {
                    this.currentAnimation = this.animations.moveUp;
                    this.image = this.animations.moveUp.image;
                }
                else if (this.mode === 'respawning') {
                    this.currentAnimation = this.animations.respawnUp;
                    this.image = this.animations.respawnUp.image;
                }
                else {
                    this.currentAnimation = this.animations.flee;
                    this.image = this.animations.flee.image;
                }
                break;
            case 'down':
                if (this.mode != 'fleeing' && this.mode != 'respawning') {
                    this.currentAnimation = this.animations.moveDown;
                    this.image = this.animations.moveDown.image;
                }
                else if (this.mode === 'respawning') {
                    this.currentAnimation = this.animations.respawnDown;
                    this.image = this.animations.respawnDown.image;
                }
                else {
                    this.currentAnimation = this.animations.flee;
                    this.image = this.animations.flee.image;
                }
                break;
        }
    }

    move() {
        this.updateCurrentTile();
        if (this.queuedDirection != this.direction && this.checkDirectionAvailable(this.queuedDirection)) {
            this.direction = this.queuedDirection;
            this.switchSprite(this.direction);
        }

        if (this.direction === 'left' && this.checkDirectionAvailable(this.direction)) {
            this.position.x -= this.speed;
            this.position.y = this.currentTile.position.y + (this.currentTile.height / 2);
        }
        else if (this.direction === 'right' && this.checkDirectionAvailable(this.direction)) {
            this.position.x += this.speed;
            this.position.y = this.currentTile.position.y + (this.currentTile.height / 2);
        }
        else if (this.direction === 'down' && this.checkDirectionAvailable(this.direction)) {
            this.position.y += this.speed;
            this.position.x = this.currentTile.position.x + (this.currentTile.width / 2);
        }
        else if (this.direction === 'up' && this.checkDirectionAvailable(this.direction)) {
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
            this.lastTile = this.currentTile;
            this.currentTile = grid[14][27];
            this.position.x = this.currentTile.position.x;
            return;
        }
        //Offscreen right
        if (this.position.x > canvas.width - (this.currentTile.width / 2) && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
            this.lastTile = this.currentTile;
            this.currentTile = grid[14][0];
            this.position.x = this.currentTile.position.x + (this.currentTile.width / 2);
            return;
        }
        //Left
        if (this.position.x < this.currentTile.position.x - (this.currentTile.width / 2) && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
            this.lastTile = this.currentTile;
            this.currentTile = grid[this.currentTile.index.row][this.currentTile.index.column - 1];
        }
        //Right
        else if (this.position.x > this.currentTile.position.x + this.currentTile.width + (this.currentTile.width / 2) && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
            this.lastTile = this.currentTile;
            this.currentTile = grid[this.currentTile.index.row][this.currentTile.index.column + 1];
        }
        //Down
        else if (this.position.y > this.currentTile.position.y + this.currentTile.height + (this.currentTile.height / 2) && this.position.x > this.currentTile.position.x && this.position.x < this.currentTile.position.x + this.currentTile.width) {
            this.lastTile = this.currentTile;
            this.currentTile = grid[this.currentTile.index.row + 1][this.currentTile.index.column];
        }
        //Up
        else if (this.position.y < this.currentTile.position.y - (this.currentTile.height / 2) && this.position.x > this.currentTile.position.x && this.position.x < this.currentTile.position.x + this.currentTile.width) {
            this.lastTile = this.currentTile;
            this.currentTile = grid[this.currentTile.index.row - 1][this.currentTile.index.column];
        }
    }

    checkDirectionAvailable(directionToCheck) {
        if (directionToCheck === 'left') {
            if (this.currentTile.index.column > 0 && grid[this.currentTile.index.row][this.currentTile.index.column - 1].wall) return false;
            else if (this.direction != 'right') return true;
        }
        else if (directionToCheck === 'right') {
            if (this.currentTile.index.column < columns - 1 && grid[this.currentTile.index.row][this.currentTile.index.column + 1].wall) return false;
            else if (this.direction != 'left') return true;
        }
        else if (directionToCheck === 'down') {
            if (this.currentTile.index.row < rows - 1 && grid[this.currentTile.index.row + 1][this.currentTile.index.column].wall) return false;
            else if (this.direction != 'up') return true;
        }
        else if (directionToCheck === 'up') {
            if (this.currentTile.index.row > 0 && grid[this.currentTile.index.row - 1][this.currentTile.index.column].wall) return false;
            else if (this.direction != 'down') return true;
        }
    }

    followPath() {
        if (this.currentPath.length >= 1) {
            if (this.currentPath[0].position.x < this.currentTile.position.x && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
                this.queuedDirection = 'left';
            }
            //Right
            else if (this.currentPath[0].position.x >= this.currentTile.position.x + this.currentTile.width && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
                this.queuedDirection = 'right';
            }
            //Down
            else if (this.currentPath[0].position.y >= this.currentTile.position.y + this.currentTile.height && this.position.x > this.currentTile.position.x && this.position.x < this.currentTile.position.x + this.currentTile.width) {
                this.queuedDirection = 'down';
            }
            //Up
            else if (this.currentPath[0].position.y < this.currentTile.position.y && this.position.x > this.currentTile.position.x && this.position.x < this.currentTile.position.x + this.currentTile.width) {
                this.queuedDirection = 'up';
            }
        }
    }

    pickRandomHomeTile() {
        let tileIndex = Math.floor(Math.random() * this.homeTiles.length);
        return this.homeTiles[tileIndex];
    }

    scatter() {
        if (!this.scatterTile || this.currentPath.length <= 1) this.scatterTile = this.pickRandomHomeTile();
        this.currentPath = this.pathfinder.pathfind(this.currentTile, this.scatterTile);
        this.followPath();
    }

    flee() {
        let fleeingEnd = performance.now();
        if (fleeingEnd - this.fleeingStart > 5000) {
            this.speed = ghostSpeed;
            this.mode = 'chasing';
            this.switchSprite(this.direction);
        }
        else {
            if (!this.turningAround) this.scatter();
        }
        if (!(this.turningTile.index.row === this.currentTile.index.row && this.turningTile.index.column === this.currentTile.index.column)) {
            if (this.turningAround) this.turningAround = false;
        }
    }

    returnHome() {
        this.currentPath = this.pathfinder.pathfind(this.currentTile, this.startingTile);
        this.followPath();
        if (this.currentPath.length <= 1) {
            this.speed = ghostSpeed;
            this.mode = 'chasing';
        }
    }
}
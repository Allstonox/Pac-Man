class Ghost {
    constructor({ position, radius, currentTile, color, speed = 0.6, mode = 'scatter', direction = 'up'}) {
        this.position = position;
        this.radius = radius;
        this.pathfinder = new Pathfinder(this);
        this.currentTile = currentTile;
        this.lastTile = currentTile;
        this.color = color;
        this.speed = speed;
        this.mode = mode;
        this.direction = direction;
        this.queuedDirection;
        this.currentPath;
        this.lastPos = this.position;
        this.scatterTile;
    }

    show() {
        c.fillStyle = `rgb(${this.color.red}, ${this.color.green}, ${this.color.blue})`;
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        c.fill();
    }

    move() {
        this.updateCurrentTile();
        if(this.checkDirectionAvailable(this.queuedDirection)) this.direction = this.queuedDirection;
        
        if(this.direction === 'left' && this.checkDirectionAvailable(this.direction)) {
            this.position.x-=this.speed;
            this.position.y = this.currentTile.position.y + (this.currentTile.height / 2);
        } 
        else if(this.direction === 'right' && this.checkDirectionAvailable(this.direction)) {
            this.position.x+=this.speed;
            this.position.y = this.currentTile.position.y + (this.currentTile.height / 2);
        } 
        else if(this.direction === 'down' && this.checkDirectionAvailable(this.direction)) {
            this.position.y+=this.speed;
            this.position.x = this.currentTile.position.x + (this.currentTile.width / 2);
        } 
        else if(this.direction === 'up' && this.checkDirectionAvailable(this.direction)) {
            this.position.y-=this.speed;
            this.position.x = this.currentTile.position.x + (this.currentTile.width / 2);
        } 
        // this.checkMoving();
        // this.lastPos = this.position;
    }

    checkMoving() {
        if(this.position.x === this.lastPos.x && this.position.y === this.lastPos.y) {
            this.moveRandomDirection();
        }
    }

    moveRandomDirection() {
        let randVal = Math.floor(Math.random() * 4);
        if(randVal === 0) {
            if(this.direction === 'down') this.moveRandomDirection();
            else this.queuedDirection = 'up';
        }
        if(randVal === 1) {
            if(this.direction === 'up') this.moveRandomDirection();
            else this.queuedDirection = 'down';
        }
        if(randVal === 2) {
            if(this.direction === 'left') this.moveRandomDirection();
            else this.queuedDirection = 'right';
        }
        if(randVal === 3) {
            if(this.direction === 'right') this.moveRandomDirection();
            else this.queuedDirection = 'left';
        }
    }

    updateCurrentTile() {
        //Offscreen left
        if(this.position.x < 0 + (this.currentTile.width / 2) && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
            this.lastTile = this.currentTile;
            this.currentTile = grid[14][27];
            this.position.x = this.currentTile.position.x;
            return;
        } 
        //Offscreen right
        if(this.position.x > canvas.width - (this.currentTile.width / 2) && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
            this.lastTile = this.currentTile;
            this.currentTile = grid[14][0];
            this.position.x = this.currentTile.position.x + (this.currentTile.width / 2);
            return;
        } 
        //Left
        if(this.position.x < this.currentTile.position.x - (this.currentTile.width / 2) && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
            this.lastTile = this.currentTile;
            this.currentTile = grid[this.currentTile.index.row][this.currentTile.index.column - 1]; 
        } 
        //Right
        else if(this.position.x > this.currentTile.position.x + this.currentTile.width + (this.currentTile.width / 2) && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
            this.lastTile = this.currentTile;
            this.currentTile = grid[this.currentTile.index.row][this.currentTile.index.column + 1]; 
        } 
        //Down
        else if(this.position.y > this.currentTile.position.y + this.currentTile.height + (this.currentTile.height / 2) && this.position.x > this.currentTile.position.x && this.position.x < this.currentTile.position.x + this.currentTile.width) {
            this.lastTile = this.currentTile;
            this.currentTile = grid[this.currentTile.index.row + 1][this.currentTile.index.column];     
        } 
        //Up
        else if(this.position.y < this.currentTile.position.y - (this.currentTile.height / 2) && this.position.x > this.currentTile.position.x && this.position.x < this.currentTile.position.x + this.currentTile.width) {
            this.lastTile = this.currentTile;
            this.currentTile = grid[this.currentTile.index.row - 1][this.currentTile.index.column]; 
        }
    }

    checkDirectionAvailable(directionToCheck) {
        if(directionToCheck === 'left') {
            if(this.currentTile.index.column > 0 && grid[this.currentTile.index.row][this.currentTile.index.column - 1].wall) return false; 
            return true;
        }
        else if(directionToCheck === 'right') {
            if(this.currentTile.index.column < columns - 1 && grid[this.currentTile.index.row][this.currentTile.index.column + 1].wall) return false; 
            return true;
        }
        else if(directionToCheck === 'down') {
            if(this.currentTile.index.row < rows - 1 && grid[this.currentTile.index.row + 1][this.currentTile.index.column].wall) return false; 
            return true;
        }
        else if(directionToCheck === 'up') {
            if(this.currentTile.index.row > 0 && grid[this.currentTile.index.row - 1][this.currentTile.index.column].wall) return false;
            return true; 
        }
    }

    followPath() {
        if(this.currentPath.length >= 1) {
            if(this.currentPath[0].position.x < this.currentTile.position.x && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
                this.queuedDirection = 'left';
            } 
            //Right
            else if(this.currentPath[0].position.x >= this.currentTile.position.x + this.currentTile.width && this.position.y > this.currentTile.position.y && this.position.y < this.currentTile.position.y + this.currentTile.height) {
                this.queuedDirection = 'right';
            } 
            //Down
            else if(this.currentPath[0].position.y >= this.currentTile.position.y + this.currentTile.height && this.position.x > this.currentTile.position.x && this.position.x < this.currentTile.position.x + this.currentTile.width) {
                this.queuedDirection = 'down';
            } 
            //Up
            else if(this.currentPath[0].position.y < this.currentTile.position.y && this.position.x > this.currentTile.position.x && this.position.x < this.currentTile.position.x + this.currentTile.width) {
                this.queuedDirection = 'up';
            }
        }
    }

    pickRandomHomeTile() {
        let tileIndex = Math.floor(Math.random() * this.homeTiles.length);
        return this.homeTiles[tileIndex];
    }

    scatter() {
        if(!this.scatterTile || this.currentPath.length <= 1) this.scatterTile = this.pickRandomHomeTile();
        this.currentPath = this.pathfinder.pathfind(this.currentTile, this.scatterTile);
        this.followPath();
    }
}
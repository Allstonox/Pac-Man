class Blinky extends Ghost {
    constructor({ position, radius, currentTile, animations, color = {red: 255, green: 0, blue: 0}}) {
        super({ position, radius, currentTile, animations, color})
        this.homeTiles =[grid[1][15], grid[1][26], grid[8][26], grid[8][15]];
    }

    update() {
        if(this.mode === 'chasing') {
            this.currentPath = this.pathfinder.pathfind(this.currentTile, player.currentTile);
            this.followPath();
        }
        else if(this.mode === 'scatter') {
            this.scatter();
        }
        else if(this.mode === 'fleeing') {
            this.flee();
        }
        else if(this.mode === 'respawning') {
            this.returnHome();
        }
        this.move();
        this.show();
        // this.pathfinder.showPath(this.currentPath);
    }
}
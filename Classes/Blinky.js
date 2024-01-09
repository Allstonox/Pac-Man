class Blinky extends Ghost {
    constructor({ position, radius, currentTile, color = {red: 255, green: 0, blue: 0}}) {
        super({ position, radius, currentTile, color})
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
        this.move();
        this.show();
        // this.pathfinder.showPath(this.currentPath);
    }
}
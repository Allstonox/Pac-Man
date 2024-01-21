class Clyde extends Ghost {
    constructor({ position, radius, currentTile, animations, color = {red: 255, green: 165, blue: 0}}) {
        super({ position, radius, currentTile, animations, color})
        this.homeTiles =[grid[29][1], grid[20][1], grid[20][12], grid[29][12]];
    }

    update() {
        if(this.mode === 'chasing') {
            this.currentPath = this.pathfinder.pathfind(this.currentTile, player.currentTile);
            if(this.currentPath.length <= 8) this.currentPath = this.pathfinder.pathfind(this.currentTile, grid[29][1]);
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
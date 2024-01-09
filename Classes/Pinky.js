class Pinky extends Ghost {
    constructor({ position, radius, currentTile, color = {red: 255, green: 100, blue: 203}}) {
        super({ position, radius, currentTile, color})
        this.homeTiles =[grid[1][1], grid[1][12], grid[8][12], grid[8][1]]
    }

    update() {
        if(this.mode === 'chasing') {
            let tileToFind = this.findTilesAheadofPlayer();
            this.currentPath = this.pathfinder.pathfind(this.currentTile, tileToFind);
            this.followPath();
        }
        else if(this.mode === 'scatter') {
            this.scatter();
        }
        this.move();
        this.show();
        // this.pathfinder.showPath(this.currentPath);
    }

    findTilesAheadofPlayer() {
        if(player.controls.direction === 'up') {
            for(let i = 4; i >= 0; i--) {
                if(player.currentTile.index.row - i >= 0) {
                    if(!grid[player.currentTile.index.row - i][player.currentTile.index.column].wall) return grid[player.currentTile.index.row - i][player.currentTile.index.column];
                }
            }
        } 
        else if(player.controls.direction === 'down') {
            for(let i = 4; i >= 0; i--) {
                if(player.currentTile.index.row + i < rows) {
                    if(!grid[player.currentTile.index.row + i][player.currentTile.index.column].wall) return grid[player.currentTile.index.row + i][player.currentTile.index.column];
                }
            }
        } 
        else if(player.controls.direction === 'right') {
            for(let i = 4; i >= 0; i--) {
                if(player.currentTile.index.column + i < columns) {
                    if(!grid[player.currentTile.index.row][player.currentTile.index.column + i].wall) return grid[player.currentTile.index.row][player.currentTile.index.column + i];
                }
            }
        } 
        else if(player.controls.direction === 'left') {
            for(let i = 4; i >= 0; i--) {
                if(player.currentTile.index.column - i >= 0) {
                    if(!grid[player.currentTile.index.row][player.currentTile.index.column - i].wall) return grid[player.currentTile.index.row][player.currentTile.index.column - i];
                }
            }
        } 
    }
}
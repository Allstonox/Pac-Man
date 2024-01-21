class Inky extends Ghost {
    constructor({ position, radius, currentTile, animations, color = {red: 0, green: 200, blue: 203}}) {
        super({ position, radius, currentTile, animations, color})
        this.homeTiles =[grid[29][26], grid[29][15], grid[20][26], grid[20][15]];
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

    findTilesAheadofPlayer() {
        let blinkyDist = Math.floor(calcDist(ghosts[0].position, player.position) / player.currentTile.width) * 2;
        if(player.controls.direction === 'up') {
            for(let i = blinkyDist; i >= 0; i--) {
                if(player.currentTile.index.row - i >= 0) {
                    if(!grid[player.currentTile.index.row - i][player.currentTile.index.column].wall) return grid[player.currentTile.index.row - i][player.currentTile.index.column];
                }
            }
        } 
        else if(player.controls.direction === 'down') {
            for(let i = blinkyDist; i >= 0; i--) {
                if(player.currentTile.index.row + i <= rows - 1) {
                    if(!grid[player.currentTile.index.row + i][player.currentTile.index.column].wall) return grid[player.currentTile.index.row + i][player.currentTile.index.column];
                }
            }
        } 
        else if(player.controls.direction === 'right') {
            for(let i = blinkyDist; i >= 0; i--) {
                if(player.currentTile.index.column + i <= columns - 1) {
                    if(!grid[player.currentTile.index.row][player.currentTile.index.column + i].wall) return grid[player.currentTile.index.row][player.currentTile.index.column + i];
                }
            }
        } 
        else if(player.controls.direction === 'left') {
            for(let i = blinkyDist; i >= 0; i--) {
                if(player.currentTile.index.column - i >= 0) {
                    if(!grid[player.currentTile.index.row][player.currentTile.index.column - i].wall) return grid[player.currentTile.index.row][player.currentTile.index.column - i];
                }
            }
        } 
    }
}
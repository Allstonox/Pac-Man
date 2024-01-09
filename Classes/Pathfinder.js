class Pathfinder {
    constructor(parent) {
        this.direction = 'up';
        this.grid = grid.slice();
        this.parent = parent;
    }

    pathfind(currentTile, target) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                this.grid[i][j].explored = false;
            }
        }
        this.discoveredTiles = [];
        currentTile.pathToSpace = [];
        let path = this.recursiveCheck(currentTile, target);
        // this.showPath(path);
        return path;
    }

    recursiveCheck(currentTile, target) {
        if (currentTile.index.row === target.index.row && currentTile.index.column === target.index.column) {
            return currentTile.pathToSpace;
        }
        else {
            //Check up
            if (currentTile.index.row > 0) {
                if (!this.grid[currentTile.index.row - 1][currentTile.index.column].wall && !this.grid[currentTile.index.row - 1][currentTile.index.column].explored) {
                    this.grid[currentTile.index.row - 1][currentTile.index.column].pathToSpace = [...currentTile.pathToSpace, this.grid[currentTile.index.row - 1][currentTile.index.column]];
                    this.grid[currentTile.index.row - 1][currentTile.index.column].gScore = this.grid[currentTile.index.row - 1][currentTile.index.column].pathToSpace.length;
                    if(currentTile.index.row - 1 === this.parent.lastTile.index.row && currentTile.index.column === this.parent.lastTile.index.column) this.grid[currentTile.index.row - 1][currentTile.index.column].fScore = 10000;
                    else this.grid[currentTile.index.row - 1][currentTile.index.column].fScore = this.calculateFscore(this.grid[currentTile.index.row - 1][currentTile.index.column], target);
                    if (this.discoveredTiles.indexOf(this.grid[currentTile.index.row - 1][currentTile.index.column]) === -1) this.discoveredTiles.push(this.grid[currentTile.index.row - 1][currentTile.index.column]);
                }
            }
            //Check down
            if (currentTile.index.row < rows - 1) {
                if (!this.grid[currentTile.index.row + 1][currentTile.index.column].wall && !this.grid[currentTile.index.row + 1][currentTile.index.column].explored) {
                    this.grid[currentTile.index.row + 1][currentTile.index.column].pathToSpace = [...currentTile.pathToSpace, this.grid[currentTile.index.row + 1][currentTile.index.column]];
                    this.grid[currentTile.index.row + 1][currentTile.index.column].gScore = this.grid[currentTile.index.row + 1][currentTile.index.column].pathToSpace.length;
                    if(currentTile.index.row + 1 === this.parent.lastTile.index.row && currentTile.index.column === this.parent.lastTile.index.column) this.grid[currentTile.index.row + 1][currentTile.index.column].fScore = 10000;
                    else this.grid[currentTile.index.row + 1][currentTile.index.column].fScore = this.calculateFscore(this.grid[currentTile.index.row + 1][currentTile.index.column], target);
                    if (this.discoveredTiles.indexOf(this.grid[currentTile.index.row + 1][currentTile.index.column]) === -1) this.discoveredTiles.push(this.grid[currentTile.index.row + 1][currentTile.index.column]);
                }
            }
            //Check right
            if (currentTile.index.column < columns - 1) {
                if (!this.grid[currentTile.index.row][currentTile.index.column + 1].wall && !this.grid[currentTile.index.row][currentTile.index.column + 1].explored) {
                    this.grid[currentTile.index.row][currentTile.index.column + 1].pathToSpace = [...currentTile.pathToSpace, this.grid[currentTile.index.row][currentTile.index.column + 1]];
                    this.grid[currentTile.index.row][currentTile.index.column + 1].gScore = this.grid[currentTile.index.row][currentTile.index.column + 1].pathToSpace.length;
                    if(currentTile.index.row === this.parent.lastTile.index.row && currentTile.index.column + 1 === this.parent.lastTile.index.column) this.grid[currentTile.index.row][currentTile.index.column + 1].fScore = 10000;
                    else this.grid[currentTile.index.row][currentTile.index.column + 1].fScore = this.calculateFscore(this.grid[currentTile.index.row][currentTile.index.column + 1], target);
                    if (this.discoveredTiles.indexOf(this.grid[currentTile.index.row][currentTile.index.column + 1]) === -1) this.discoveredTiles.push(this.grid[currentTile.index.row][currentTile.index.column + 1]);
                }
            }
            //Check left
            if (currentTile.index.column > 0) {
                if (!this.grid[currentTile.index.row][currentTile.index.column - 1].wall && !this.grid[currentTile.index.row][currentTile.index.column - 1].explored) {
                    this.grid[currentTile.index.row][currentTile.index.column - 1].pathToSpace = [...currentTile.pathToSpace, this.grid[currentTile.index.row][currentTile.index.column - 1]];
                    this.grid[currentTile.index.row][currentTile.index.column - 1].gScore = this.grid[currentTile.index.row][currentTile.index.column - 1].pathToSpace.length;
                    if(currentTile.index.row === this.parent.lastTile.index.row && currentTile.index.column - 1 === this.parent.lastTile.index.column) this.grid[currentTile.index.row][currentTile.index.column - 1].fScore = 10000;
                    else this.grid[currentTile.index.row][currentTile.index.column - 1].fScore = this.calculateFscore(this.grid[currentTile.index.row][currentTile.index.column - 1], target);
                    if (this.discoveredTiles.indexOf(this.grid[currentTile.index.row][currentTile.index.column - 1]) === -1) this.discoveredTiles.push(this.grid[currentTile.index.row][currentTile.index.column - 1]);
                }
            }
            currentTile.explored = true;
            if (this.discoveredTiles.indexOf(currentTile) != -1) this.discoveredTiles.splice(this.discoveredTiles.indexOf(currentTile), 1);
            let bestFscore = 1000000;
            let tileChosen;
            for (let i = 0; i < this.discoveredTiles.length; i++) {
                if (this.discoveredTiles[i].fScore < bestFscore) {
                    tileChosen = this.discoveredTiles[i];
                    bestFscore = this.discoveredTiles[i].fScore;
                }
            }
            return this.recursiveCheck(tileChosen, target);
        }
    }

    showPath(pathToShow) {

        for (let i = 0; i < pathToShow.length; i++) {
            c.fillStyle = `rgba(${this.parent.color.red}, ${this.parent.color.green}, ${this.parent.color.blue}, 0.5)`;
            c.beginPath();
            c.rect(pathToShow[i].position.x, pathToShow[i].position.y, pathToShow[i].width, pathToShow[i].height);
            c.fill();
        }
    }

    calculateFscore(spaceToCalculate, target) {
        let hScore = calcDist(spaceToCalculate.position, target.position) / spaceToCalculate.width;
        let fScore = spaceToCalculate.gScore + hScore;
        return fScore;
    }
}
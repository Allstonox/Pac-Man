class GridSpace {
    constructor({ position, width, height, index, contents = null, wall = false }) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.contents = contents;
        this.wall = wall;
        this.index = index;
    }

    update() {
        this.show();
    }

    show() {
        // c.strokeStyle = 'red';
        // c.beginPath();
        // c.rect(this.position.x, this.position.y, this.width, this.height);
        // c.stroke();

        if (this.wall) {
            c.fillStyle = 'rgb(50, 50, 160)';
            c.beginPath();
            c.rect(this.position.x, this.position.y, this.width, this.height);
            c.fill();
        }

        if (this.contents === 'dot') {
            c.fillStyle = 'white';
            c.beginPath();
            c.arc(this.position.x + (this.width / 2), this.position.y + (this.height / 2), (this.height / 6), 0, 2 * Math.PI);
            c.fill();
        }
        else if (this.contents === 'bigDot') {
            c.fillStyle = 'white';
            c.beginPath();
            c.arc(this.position.x + (this.width / 2), this.position.y + (this.height / 2), (this.height / 3), 0, 2 * Math.PI);
            c.fill();
        }
    }
}
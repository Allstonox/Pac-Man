class Controls {
    constructor() {
        this.#addKeyboardListeners();
        this.direction = 'left';
    }

    #addKeyboardListeners() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                        this.queuedDirection = 'left';
                    break;
                case 'ArrowRight':
                    this.queuedDirection = 'right';
                    break;
                case 'ArrowUp':
                    this.queuedDirection = 'up';
                    break;
                case 'ArrowDown':
                    this.queuedDirection = 'down';
                    break;
            }
        }
    }
}
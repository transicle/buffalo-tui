export const properties = {
    // hardcoded element list with what properties each has because I was too lazy
    // to automize it lol
    frame: {
        sizeX: 'number',
        sizeY: 'number',
        posX: 'number',
        posY: 'number',
        windowTitle: 'string',
        borderColor: 'ColorManager',
    }
}

export class Element {
    constructor() {
        this.visible = true;
        this.zIndex = 0;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    setZIndex(z) {
        this.zIndex = z;
    }
}
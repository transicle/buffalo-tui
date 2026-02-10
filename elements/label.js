import { Element } from "../classes/element.js";
import { ColorManager } from "../classes/colorManager.js";

export class Label extends Element {
    constructor(posX, posY, text, color = null) {
        super();
        this.posX = posX;
        this.posY = posY;
        this.text = text;
        this.color = color || new ColorManager().setColor(255, 255, 255);
    }

    setText(text) {
        this.text = text;
    }

    setColor(R, G, B) {
        this.color = new ColorManager().setColor(R, G, B);
    }

    drawToBuffer(screen) {
        if (!this.visible) return;
        screen.writeString(this.posX, this.posY, this.text, this.color);
    }
}

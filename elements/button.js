import { Element } from "../classes/element.js";
import { ColorManager } from "../classes/colorManager.js";

export class Button extends Element {
    constructor(posX, posY, text, color = null) {
        super();
        this.posX = posX;
        this.posY = posY;
        this.text = text;
        this.color = color || new ColorManager().setColor(255, 255, 255);
        this.hovered = false;
    }

    setText(text) {
        this.text = text;
    }

    setHovered(hovered) {
        this.hovered = hovered;
    }

    drawToBuffer(screen) {
        if (!this.visible) return;
        
        const buttonColor = this.hovered 
            ? new ColorManager().setColor(100, 255, 100)
            : this.color;
        
        screen.writeString(this.posX, this.posY, `[ ${this.text} ]`, buttonColor);
    }
}

import { Element } from "../classes/element.js";
import { ColorManager } from "../classes/colorManager.js";

export class Input extends Element {
    constructor(posX, posY, width, label, color = null) {
        super();
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.label = label;
        this.value = "";
        this.color = color || new ColorManager().setColor(255, 255, 255);
        this.focused = false;
    }

    setValue(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    setFocus(focused) {
        this.focused = focused;
    }

    drawToBuffer(screen) {
        if (!this.visible) return;
        
        if (this.label) {
            screen.writeString(this.posX, this.posY, this.label, this.color);
        }

        const inputY = this.label ? this.posY + 1 : this.posY;
        const display = this.value.padEnd(this.width, ' ').substring(0, this.width);
        const inputColor = this.focused 
            ? new ColorManager().setColor(100, 200, 255)
            : new ColorManager().setColor(150, 150, 150);
        
        screen.writeString(this.posX, inputY, `[${display}]`, inputColor);
    }
}

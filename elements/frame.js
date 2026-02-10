import { properties, Element } from "../classes/element.js";
import { ColorManager } from "../classes/colorManager.js";

export class Frame extends Element {
    sizeX = 0;
    sizeY = 0;
    posX = 0;
    posY = 0;
    windowTitle = "";
    borderColor = new ColorManager().setColor(255, 255, 255);
    backgroundColor = null;
    content = [];
    visible = true;
    zIndex = 0;

    constructor(sizeX, sizeY, posX, posY, windowTitle, borderColor) {
        super();
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.posX = posX;
        this.posY = posY;
        this.windowTitle = windowTitle || "";
        this.borderColor = borderColor || new ColorManager().setColor(255, 255, 255);
    }

    setWindowTitle(title) {
        this.windowTitle = title;
    }

    setBorderColor(R, G, B) {
        this.borderColor = new ColorManager().setColor(R, G, B);
    }

    setBackgroundColor(R, G, B) {
        this.backgroundColor = new ColorManager().setColor(R, G, B);
    }

    addContent(x, y, text, color = null) {
        this.content.push({ x, y, text, color });
    }

    clearContent() {
        this.content = [];
    }

    drawToBuffer(screen) {
        if (!this.visible) return;
        if (this.backgroundColor) {
            for (let y = 1; y < this.sizeY - 1; y++) {
                for (let x = 1; x < this.sizeX - 1; x++) {
                    screen.writeAt(this.posX + x, this.posY + y, ' ', this.backgroundColor);
                }
            }
        }

        screen.drawRect(this.posX, this.posY, this.sizeX, this.sizeY, false, '█', this.borderColor);

        if (this.windowTitle && this.sizeX > 4) {
            const titleText = ` ${this.windowTitle} `;
            const titleX = this.posX + Math.floor((this.sizeX - titleText.length) / 2);
            screen.writeString(titleX, this.posY, titleText, this.borderColor);
        }

        for (const item of this.content) {
            const contentX = this.posX + item.x + 1;
            const contentY = this.posY + item.y + 1;
            screen.writeString(contentX, contentY, item.text, item.color);
        }
    }
}
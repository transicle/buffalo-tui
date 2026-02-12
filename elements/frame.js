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

    moveWindow(newX, newY) {
        this.posX = newX;
        this.posY = newY;
    }

    resizeWindow(newSizeX, newSizeY) {
        const titleText = this.windowTitle ? ` ${this.windowTitle} ` : '';
        let minWidth = Math.max(4, titleText.length || 0);
        for (const item of this.content) {
            const contentWidth = item.x + (item.text ? item.text.length : 0) + 2;
            if (contentWidth > minWidth) {
                minWidth = contentWidth;
            }
        }
        this.sizeX = Math.max(minWidth, newSizeX);
        this.sizeY = newSizeY;
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
            const innerLeft = this.posX + 1;
            const innerRight = this.posX + this.sizeX - 2;
            const innerTop = this.posY + 1;
            const innerBottom = this.posY + this.sizeY - 2;

            if (contentY < innerTop || contentY > innerBottom) {
                continue;
            }

            const text = item.text || '';
            const startIndex = Math.max(0, innerLeft - contentX);
            const endIndex = Math.min(text.length, innerRight - contentX + 1);

            if (startIndex >= endIndex) {
                continue;
            }

            screen.writeString(
                contentX + startIndex,
                contentY,
                text.slice(startIndex, endIndex),
                item.color,
            );
        }
    }
}
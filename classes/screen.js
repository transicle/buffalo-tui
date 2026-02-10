import { ColorManager } from './colorManager.js';

export class Screen {
    constructor() {
        this.width = process.stdout.columns || 80;
        this.height = process.stdout.rows || 24;
        this.buffer = [];
        this.colorBuffer = [];
        this.elements = [];
        this.controlBarHeight = 3;
        this.controlBarText = '';
        
        this.clearBuffer();
        
        process.stdout.on('resize', () => {
            this.width = process.stdout.columns;
            this.height = process.stdout.rows;
            this.clearBuffer();
            this.render();
        });
    }

    clearBuffer() {
        this.buffer = [];
        this.colorBuffer = [];
        
        for (let y = 0; y < this.height; y++) {
            this.buffer[y] = [];
            this.colorBuffer[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.buffer[y][x] = ' ';
                this.colorBuffer[y][x] = null;
            }
        }
    }

    clear() {
        this.clearBuffer();
    }

    writeAt(x, y, char, color = null) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.buffer[y][x] = char || ' ';
            this.colorBuffer[y][x] = color;
        }
    }

    writeString(x, y, str, color = null) {
        for (let i = 0; i < str.length; i++) {
            this.writeAt(x + i, y, str[i], color);
        }
    }

    drawRect(x, y, width, height, filled = false, char = '█', borderColor = null) {
        if (filled) {
            for (let dy = 0; dy < height; dy++) {
                for (let dx = 0; dx < width; dx++) {
                    this.writeAt(x + dx, y + dy, char, borderColor);
                }
            }
        } else {
            for (let dx = 0; dx < width; dx++) {
                this.writeAt(x + dx, y, '─', borderColor);
                this.writeAt(x + dx, y + height - 1, '─', borderColor);
            }
            
            for (let dy = 0; dy < height; dy++) {
                this.writeAt(x, y + dy, '│', borderColor);
                this.writeAt(x + width - 1, y + dy, '│', borderColor);
            }
            
            this.writeAt(x, y, '┌', borderColor);
            this.writeAt(x + width - 1, y, '┐', borderColor);
            this.writeAt(x, y + height - 1, '└', borderColor);
            this.writeAt(x + width - 1, y + height - 1, '┘', borderColor);
        }
    }

    drawLine(x1, y1, x2, y2, char = '─', color = null) {
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = x1 < x2 ? 1 : -1;
        const sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;

        let x = x1;
        let y = y1;

        while (true) {
            this.writeAt(x, y, char, color);
            
            if (x === x2 && y === y2) break;
            
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }
    }

    addElement(element) {
        this.elements.push(element);
        this.elements.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    }

    removeElement(element) {
        const index = this.elements.indexOf(element);
        if (index > -1) {
            this.elements.splice(index, 1);
        }
    }

    setControlBar(text) {
        this.controlBarText = text;
    }

    drawControlBar() {
        const barY = this.height - this.controlBarHeight;
        const barColor = new ColorManager().setColor(200, 200, 200);
        const bgColor = new ColorManager().setColor(40, 40, 40);
        
        for (let x = 0; x < this.width; x++) {
            this.writeAt(x, barY, '═', barColor);
        }
        
        for (let y = barY + 1; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.writeAt(x, y, ' ', bgColor);
            }
        }
        
        if (this.controlBarText) {
            this.writeString(2, barY + 1, this.controlBarText, new ColorManager().setColor(255, 255, 255));
        }
    }

    renderElements() {
        for (const element of this.elements) {
            if (element.visible !== false && typeof element.drawToBuffer === 'function') {
                element.drawToBuffer(this);
            }
        }
    }

    render() {
        this.clearBuffer();
        this.renderElements();
        this.drawControlBar();
        
        process.stdout.write('\x1b[H\x1b[?25l');
        
        let output = '';
        let lastColor = null;
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const char = this.buffer[y][x];
                const color = this.colorBuffer[y][x];
                
                if (color && color !== lastColor) {
                    output += color.toANSIForeground();
                    lastColor = color;
                } else if (!color && lastColor) {
                    output += ColorManager.reset();
                    lastColor = null;
                }
                
                output += char;
            }
            
            if (y < this.height - 1) {
                output += '\n';
            }
        }
        
        if (lastColor) {
            output += ColorManager.reset();
        }
        
        process.stdout.write(output);
    }

    enterFullscreen() {
        process.stdout.write('\x1b[?1049h');
        process.stdout.write('\x1b[2J');
        process.stdout.write('\x1b[?25l');
    }

    exitFullscreen() {
        process.stdout.write('\x1b[?25h');
        process.stdout.write('\x1b[?1049l');
    }

    getUsableHeight() {
        return this.height - this.controlBarHeight;
    }

    cleanup() {
        this.exitFullscreen();
    }
}

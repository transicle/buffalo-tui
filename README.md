# Buffalo Terminal UI Framework

A beginner-friendly TUI (Terminal User Interface) framework for Node.js projects.

## Features

- 🖥️ **Fullscreen Terminal Buffer** - Takes over the entire terminal for immersive UI
- 🎨 **RGB Color Support** - True 24-bit color with ANSI escape sequences
- 🪟 **Frame/Window System** - Create multiple overlapping windows
- 📊 **Control Bar** - Bottom bar for controls and status
- 🎯 **Robust Drawing System** - Lines, rectangles, text, and more
- ⚡ **High Performance** - Efficient buffer-based rendering

## Installation

```bash
npm install buffalo
```

## Quick Start

```javascript
import { Screen, Frame, ColorManager } from 'buffalo';

// Create screen manager
const screen = new Screen();
screen.enterFullscreen();

// Create a frame
const frame = new Frame(
    50, 20,  // width, height
    5, 2,    // x, y position
    'My Window',  // title
    new ColorManager().setColor(100, 150, 255)  // border color
);

// Add content to frame
frame.addContent(1, 1, 'Hello, Buffalo!', new ColorManager().setColor(255, 255, 100));

// Add frame to screen
screen.addElement(frame);

// Set control bar
screen.setControlBar('Press Q to quit');

// Render
screen.render();
```

## Running the Demo

```bash
node demo.js
```

The demo showcases:
- Multiple frames with different colors
- Animated content updates
- Control bar with keyboard shortcuts
- Real-time statistics

### Demo Controls

- **Q** - Quit
- **R** - Refresh screen
- **H** - Show help

## API Documentation

### Screen

Main class for managing the terminal display.

**Methods:**
- `constructor()` - Creates a new screen manager
- `enterFullscreen()` / `exitFullscreen()` - Fullscreen mode control
- `render()` - Renders all elements to the terminal
- `addElement(element)` / `removeElement(element)` - Manage elements
- `setControlBar(text)` - Sets the control bar text
- `writeAt(x, y, char, color)` - Writes a character
- `writeString(x, y, str, color)` - Writes a string
- `drawRect(x, y, width, height, filled, char, color)` - Draws a rectangle
- `drawLine(x1, y1, x2, y2, char, color)` - Draws a line

### Frame

Window/frame element that can contain content.

**Constructor:**
```javascript
new Frame(sizeX, sizeY, posX, posY, windowTitle, borderColor)
```

**Methods:**
- `setWindowTitle(title)` - Sets the window title
- `setBorderColor(R, G, B)` - Sets border color
- `setBackgroundColor(R, G, B)` - Sets background color
- `addContent(x, y, text, color)` - Adds text content
- `clearContent()` - Clears all content
- `show()` / `hide()` - Visibility control
- `setZIndex(z)` - Sets layering order

### ColorManager

Manages RGB colors and ANSI conversion.

**Methods:**
- `setColor(R, G, B)` - Sets RGB color (0-255 each)
- `getColor()` - Returns {R, G, B} object
- `toANSIForeground()` / `toANSIBackground()` - ANSI conversion

## License

MIT

# Buffalo TUI Framework
A beginner friendly TUI framework available on various package managers for Node.js projects.

## Features
1. **Floating Windows** are movable, overlapping windows with ZIndex support.
2. **RGB Color Support** allows for full 24-bit RGB coloring with ANSI escape sequences.
3. **Input Handling** gives native keyboard event handling.
4. **Interactive Elements** such as input fields, buttons, and labels with support for keyboard navigation.
5. **Control Bar** allows you to write a useful status bar with nice keyboard shortcuts.
6. **Efficient Rendering** uses a buffer-based rendering system for seamless render updates.

## Install Buffalo 
Buffalo is available for anyone on the [NPM]() marketplace.

> [!NOTE]
> As of **Tuesday, February 10th, 2026**, Buffalo does not support TypeScript type declarations!

Install Buffalo using the Node Package Manager:
```bash
npm install buffalo
```

## Getting Started
Writing your first TUI with Buffalo is extremely easy and can be done using the code below:
```javascript
import { Screen, Frame, ColorManager, InputManager } from "buffalo";

const screen = new Screen();
const inputManager = new InputManager();

screen.enterFullscreen();

// (sizeX, sizeY, posX, posY, windowTitle, color)
const frame = new Frame(
    50, 20,
    5, 2,
    "My Buffalo Program",
    new ColorManager().setColor(100, 150, 255)
);

frame.setBackgroundColor(15, 15, 25);
frame.addContent(2, 2, "Hello, Buffalo!", new ColorManager().setColor(255, 255, 100));

screen.addElement(frame);
screen.setControlBar("Press Q to quit");

inputManager.onAny((keyName) => {
    if (keyName === "q" || keyName === "Q") {
        inputManager.stop();
        screen.exitFullscreen();
        process.exit(0);
    }
});

inputManager.start();
screen.render();
```

## Learn Buffalo through API Documentation

### Screen
Main class for managing the terminal display.
```javascript
const screen = new Screen();
```

**Properties:**
- `width` - Terminal width in characters
- `height` - Terminal height in characters
- `elements` - Array of elements to render

**Methods:**
- `enterFullscreen()` - Enter fullscreen mode
- `exitFullscreen()` - Exit fullscreen mode
- `render()` - Render all elements to terminal
- `addElement(element)` - Add an element to the screen
- `removeElement(element)` - Remove an element
- `setControlBar(text)` - Set control bar text
- `writeAt(x, y, char, color)` - Write a single character
- `writeString(x, y, str, color)` - Write a string
- `drawRect(x, y, width, height, filled, char, color)` - Draw a rectangle
- `drawLine(x1, y1, x2, y2, char, color)` - Draw a line
- `getUsableHeight()` - Get height minus control bar

### Frame

Floating window element with border, title, and content.

**Constructor:**
```javascript
new Frame(sizeX, sizeY, posX, posY, windowTitle, borderColor)
```

**Parameters:**
- `sizeX` - Width of the frame
- `sizeY` - Height of the frame
- `posX` - X position on screen
- `posY` - Y position on screen
- `windowTitle` - Title displayed on top border
- `borderColor` - ColorManager instance for border

**Methods:**
- `setWindowTitle(title)` - Update window title
- `setBorderColor(R, G, B)` - Set border color (0-255 RGB)
- `setBackgroundColor(R, G, B)` - Set background color
- `addContent(x, y, text, color)` - Add text content at position
- `clearContent()` - Remove all content
- `show()` - Make frame visible
- `hide()` - Make frame invisible
- `setZIndex(z)` - Set layering order (higher = front)

### Input

Text input field element.

**Constructor:**
```javascript
new Input(posX, posY, width, label, color)
```

**Parameters:**
- `posX` - X position on screen
- `posY` - Y position on screen
- `width` - Width of input field
- `label` - Label text above input
- `color` - ColorManager instance (optional)

**Methods:**
- `setValue(value)` - Set input value
- `getValue()` - Get current value
- `setFocus(focused)` - Set focus state
- `show()` / `hide()` - Visibility control

### Button

Clickable button element.

**Constructor:**
```javascript
new Button(posX, posY, text, color)
```

**Parameters:**
- `posX` - X position on screen
- `posY` - Y position on screen
- `text` - Button text
- `color` - ColorManager instance (optional)

**Methods:**
- `setText(text)` - Update button text
- `setHovered(hovered)` - Set hover state
- `show()` / `hide()` - Visibility control

### Label

Static text label element.

**Constructor:**
```javascript
new Label(posX, posY, text, color)
```

**Parameters:**
- `posX` - X position on screen
- `posY` - Y position on screen
- `text` - Label text
- `color` - ColorManager instance (optional)

**Methods:**
- `setText(text)` - Update label text
- `setColor(R, G, B)` - Set text color
- `show()` / `hide()` - Visibility control

### ColorManager

RGB color management with ANSI conversion.

**Methods:**
- `setColor(R, G, B)` - Set RGB color (0-255 each)
- `getColor()` - Returns `{R, G, B}` object
- `toANSIForeground()` - Convert to ANSI foreground code
- `toANSIBackground()` - Convert to ANSI background code
- `static reset()` - Get ANSI reset code

### InputManager

Keyboard input handling.

**Methods:**
- `start()` - Start capturing keyboard input
- `stop()` - Stop capturing input
- `onAny(callback)` - Register callback for any key: `(keyName, rawKey) => {}`

**Key Events:**
- `keyName` - Human-readable key name
- `rawKey` - Raw escape sequence
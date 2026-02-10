# Buffalo - Usage Examples

## Basic Setup

```javascript
import { Screen, Frame, ColorManager } from 'buffalo';

const screen = new Screen();
screen.enterFullscreen();
```

## Creating a Simple Window

```javascript
const myFrame = new Frame(
    50,    // width
    15,    // height
    10,    // x position
    5,     // y position
    'My Window',  // title
    new ColorManager().setColor(100, 150, 255)  // border color (RGB)
);

// Add the frame to the screen
screen.addElement(myFrame);
```

## Adding Content to Frames

```javascript
// Add text at position (x, y) relative to frame interior
myFrame.addContent(1, 1, 'Hello, World!', new ColorManager().setColor(255, 255, 0));
myFrame.addContent(1, 3, 'Another line', new ColorManager().setColor(200, 200, 200));

// Set background color
myFrame.setBackgroundColor(20, 20, 40);
```

## Control Bar

```javascript
// Set text in the bottom control bar
screen.setControlBar('Press Q to quit  |  Press H for help');
```

## Rendering

```javascript
// Render once
screen.render();

// Or set up an animation loop
setInterval(() => {
    // Update content
    myFrame.clearContent();
    myFrame.addContent(1, 1, `Time: ${Date.now()}`);
    
    // Render
    screen.render();
}, 100);
```

## Drawing Primitives

```javascript
// Draw a rectangle (can be filled or outlined)
screen.drawRect(10, 10, 20, 10, false, '█', new ColorManager().setColor(255, 0, 0));

// Draw a line
screen.drawLine(5, 5, 30, 5, '─', new ColorManager().setColor(0, 255, 0));

// Write text directly to buffer
screen.writeString(15, 15, 'Direct text!', new ColorManager().setColor(255, 255, 255));
```

## Color Management

```javascript
// Create colors
const red = new ColorManager().setColor(255, 0, 0);
const green = new ColorManager().setColor(0, 255, 0);
const blue = new ColorManager().setColor(0, 0, 255);

// Get RGB values
const rgb = red.getColor();  // { R: 255, G: 0, B: 0 }

// Colors are automatically converted to ANSI codes for terminal display
```

## Keyboard Input

```javascript
import * as readline from 'readline';

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

process.stdin.on('keypress', (str, key) => {
    if (key.name === 'q') {
        screen.cleanup();
        process.exit(0);
    }
    
    if (key.name === 'up') {
        // Handle up arrow
    }
});
```

## Multiple Overlapping Frames

```javascript
const frame1 = new Frame(40, 10, 5, 5, 'Frame 1', new ColorManager().setColor(255, 100, 100));
frame1.zIndex = 0;

const frame2 = new Frame(40, 10, 15, 8, 'Frame 2', new ColorManager().setColor(100, 255, 100));
frame2.zIndex = 1;  // Will render on top

screen.addElement(frame1);
screen.addElement(frame2);
```

## Cleanup

```javascript
function cleanup() {
    screen.cleanup();  // Restores terminal to normal mode
    process.stdin.setRawMode(false);
    process.exit(0);
}

// Handle process termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
```

## Complete Example

See `example.js` for a simple working example.
See `demo.js` for a comprehensive demo with multiple features.

## Tips

- Always call `screen.enterFullscreen()` before rendering
- Always call `screen.cleanup()` before exiting
- Use `setInterval()` for animations and live updates
- The control bar takes up the bottom 3 lines
- Use `getUsableHeight()` to get drawing area excluding control bar
- Colors are clamped to 0-255 range automatically

import {
  Screen,
  Frame,
  ColorManager,
  InputManager,
} from "../index.js";
import os from "os";

const screen = new Screen();
const inputManager = new InputManager();

screen.enterFullscreen();

let counter = 0;
let selectedElement = 0;
let inputValue = "";
let buttonPressed = false;
let hideOtherWindows = false;

const sampleElements = [
  { type: "input", name: "Text Input" },
  { type: "button", name: "Submit Button" },
  { type: "button", name: "Increment Counter" },
];

const windows = [
  {
    frame: new Frame(
      50,
      20,
      5,
      2,
      "System Performance",
      new ColorManager().setColor(100, 200, 255),
    ),
    update: updateSystemPerformance,
  },
  {
    frame: new Frame(
      55,
      25,
      15,
      5,
      "Sample Features",
      new ColorManager().setColor(100, 255, 150),
    ),
    update: updateSampleFeatures,
  },
];

windows.forEach((win) => {
  win.frame.setBackgroundColor(15, 15, 25);
  screen.addElement(win.frame);
});

let activeWindowIndex = 0;

function getCPUUsage() {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach((cpu) => {
    for (let type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });

  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;
  const usage = 100 - ~~((100 * idle) / total);
  return usage;
}

function updateSystemPerformance(frame) {
  frame.clearContent();

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = ((usedMem / totalMem) * 100).toFixed(1);

  const cpuUsage = getCPUUsage();
  const uptime = os.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);

  const loadAvg = os.loadavg();

  frame.addContent(
    2,
    2,
    `CPU Usage: ${cpuUsage}%`,
    new ColorManager().setColor(100, 255, 100),
  );
  frame.addContent(
    2,
    3,
    `Memory: ${memPercent}% (${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB / ${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB)`,
    new ColorManager().setColor(150, 200, 255),
  );
  frame.addContent(
    2,
    5,
    `Platform: ${os.platform()} ${os.arch()}`,
    new ColorManager().setColor(200, 200, 200),
  );
  frame.addContent(
    2,
    6,
    `Hostname: ${os.hostname()}`,
    new ColorManager().setColor(200, 200, 200),
  );
  frame.addContent(
    2,
    7,
    `Uptime: ${days}d ${hours}h ${minutes}m`,
    new ColorManager().setColor(200, 200, 200),
  );
  frame.addContent(
    2,
    9,
    `Load Average:`,
    new ColorManager().setColor(180, 180, 180),
  );
  frame.addContent(
    2,
    10,
    `  1m: ${loadAvg[0].toFixed(2)}`,
    new ColorManager().setColor(160, 160, 160),
  );
  frame.addContent(
    2,
    11,
    `  5m: ${loadAvg[1].toFixed(2)}`,
    new ColorManager().setColor(160, 160, 160),
  );
  frame.addContent(
    2,
    12,
    ` 15m: ${loadAvg[2].toFixed(2)}`,
    new ColorManager().setColor(160, 160, 160),
  );

  frame.addContent(
    2,
    14,
    `CPUs: ${os.cpus().length} cores`,
    new ColorManager().setColor(200, 200, 200),
  );
  frame.addContent(
    2,
    15,
    `Arch: ${os.cpus()[0].model.substring(0, 35)}`,
    new ColorManager().setColor(180, 180, 180),
  );
}

function updateSampleFeatures(frame) {
  frame.clearContent();

  frame.addContent(
    2,
    2,
    "Interactive Elements Demo:",
    new ColorManager().setColor(255, 255, 100),
  );
  frame.addContent(
    2,
    3,
    "Use ↑↓ arrows to navigate, Enter to interact",
    new ColorManager().setColor(100, 100, 100),
  );

  let yPos = 5;

  frame.addContent(
    2,
    yPos,
    "Label Element:",
    new ColorManager().setColor(150, 150, 150),
  );
  frame.addContent(
    2,
    yPos + 1,
    "  This is a label that cannot be changed!",
    new ColorManager().setColor(200, 200, 200),
  );
  yPos += 3;

  const inputSelected = selectedElement === 0;
  const inputColor = inputSelected
    ? new ColorManager().setColor(100, 255, 100)
    : new ColorManager().setColor(100, 200, 255);
  const inputPrefix = inputSelected ? "► " : "  ";
  frame.addContent(
    2,
    yPos,
    "Input Field:",
    new ColorManager().setColor(150, 150, 150),
  );
  const displayValue = inputValue.padEnd(30, " ").substring(0, 30);
  frame.addContent(2, yPos + 1, `${inputPrefix}[${displayValue}]`, inputColor);
  if (inputSelected) {
    frame.addContent(
      2,
      yPos + 2,
      "  Type a silly message :3",
      new ColorManager().setColor(100, 100, 100),
    );
  }
  yPos += inputSelected ? 4 : 3;

  const button1Selected = selectedElement === 1;
  const button1Color = button1Selected
    ? new ColorManager().setColor(255, 255, 100)
    : new ColorManager().setColor(100, 255, 100);
  const button1Prefix = button1Selected ? "► " : "  ";
  frame.addContent(
    2,
    yPos,
    "Submit Button:",
    new ColorManager().setColor(150, 150, 150),
  );
  frame.addContent(
    2,
    yPos + 1,
    `${button1Prefix}[ Press me!! ]`,
    button1Color,
  );
  if (buttonPressed && button1Selected) {
    frame.addContent(
      2,
      yPos + 2,
      "  Meeoww :3",
      new ColorManager().setColor(100, 255, 100),
    );
    yPos += 3;
  } else {
    yPos += 2;
  }
  yPos += 1;

  const button2Selected = selectedElement === 2;
  const button2Color = button2Selected
    ? new ColorManager().setColor(255, 255, 100)
    : new ColorManager().setColor(255, 150, 100);
  const button2Prefix = button2Selected ? "► " : "  ";
  frame.addContent(
    2,
    yPos,
    "Counter Button:",
    new ColorManager().setColor(150, 150, 150),
  );
  frame.addContent(
    2,
    yPos + 1,
    `${button2Prefix}[ Increment Counter ]`,
    button2Color,
  );
  frame.addContent(
    2,
    yPos + 2,
    `  Count: ${counter}`,
    new ColorManager().setColor(255, 200, 100),
  );
}

function updateAllWindows() {
  windows.forEach((win, idx) => {
    win.update(win.frame);
    if (idx === activeWindowIndex) {
      win.frame.setBorderColor(255, 255, 100);
      win.frame.show();
      win.frame.setZIndex(100);
    } else {
      const colors = [
        [100, 200, 255],
        [100, 255, 150],
        [255, 150, 200],
      ];
      win.frame.setBorderColor(...colors[idx]);
      win.frame.setZIndex(0);
      if (hideOtherWindows) {
        win.frame.hide();
      } else {
        win.frame.show();
      }
    }
  });
  screen.elements.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
}

function render() {
  updateAllWindows();
  let controlText = `Tab: Switch  |  Shift+Arrows: Move  |  Alt+Shift+Arrows: Resize  |  Alt+H: Focus Mode`;
  if (activeWindowIndex === 1) {
    controlText = `↑↓: Navigate  |  Enter: Select  |  Tab: Next Window  |  Shift+Arrows: Move  |  Alt+Shift+Arrows: Resize  |  Alt+H: Focus Mode`;
  }
  if (hideOtherWindows) {
    controlText = `[FOCUS MODE] |  Alt+H: Show All  |  Tab: Switch  |  Shift+Arrows: Move  |  Alt+Shift+Arrows: Resize`;
  }
  screen.setControlBar(controlText);
  screen.render();
}

inputManager.onAny((keyName, rawKey) => {
  if (activeWindowIndex === 1 && selectedElement === 0) {
    if (rawKey === "\r") {
      render();
      return;
    } else if (rawKey === "\x7f") {
      inputValue = inputValue.slice(0, -1);
      render();
      return;
    } else if (
      keyName &&
      keyName.length === 1 &&
      !rawKey.startsWith("\x1b") &&
      keyName.charCodeAt(0) >= 32
    ) {
      if (inputValue.length < 30) {
        inputValue += keyName;
        render();
      }
      return;
    }
  }

  if (keyName === "q" || keyName === "Q") {
    inputManager.stop();
    screen.exitFullscreen();
    process.exit(0);
  }

  if (rawKey === "\t") {
    activeWindowIndex = (activeWindowIndex + 1) % windows.length;
    selectedElement = 0;
    render();
    return;
  }

  if (rawKey === '\x1bh' || rawKey === '\x1bH') {
    hideOtherWindows = !hideOtherWindows;
    render();
    return;
  }

  const activeWin = windows[activeWindowIndex].frame;
  const moveStep = 2;
  const resizeStep = 2;
  const minWidth = 10;
  const minHeight = 5;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const moveActive = (dx, dy) => {
    const maxX = Math.max(1, screen.width - activeWin.sizeX - 1);
    const maxY = Math.max(1, screen.getUsableHeight() - activeWin.sizeY - 1);
    const newX = clamp(
      activeWin.posX + dx,
      1,
      maxX,
    );
    const newY = clamp(
      activeWin.posY + dy,
      1,
      maxY,
    );
    activeWin.moveWindow(newX, newY);
  };
  const resizeActive = (dw, dh) => {
    const maxWidth = Math.max(1, screen.width - activeWin.posX - 1);
    const maxHeight = Math.max(1, screen.getUsableHeight() - activeWin.posY - 1);
    const effectiveMinWidth = Math.min(minWidth, maxWidth);
    const effectiveMinHeight = Math.min(minHeight, maxHeight);
    const newWidth = clamp(activeWin.sizeX + dw, effectiveMinWidth, maxWidth);
    const newHeight = clamp(activeWin.sizeY + dh, effectiveMinHeight, maxHeight);
    activeWin.resizeWindow(newWidth, newHeight);
  };

  if (rawKey === "\x1b[1;2A") {
    moveActive(0, -moveStep);
    render();
    return;
  } else if (rawKey === "\x1b[1;2B") {
    moveActive(0, moveStep);
    render();
    return;
  } else if (rawKey === "\x1b[1;2C") {
    moveActive(moveStep, 0);
    render();
    return;
  } else if (rawKey === "\x1b[1;2D") {
    moveActive(-moveStep, 0);
    render();
    return;
  } else if (rawKey === "\x1b[1;4A") {
    resizeActive(0, -resizeStep);
    render();
    return;
  } else if (rawKey === "\x1b[1;4B") {
    resizeActive(0, resizeStep);
    render();
    return;
  } else if (rawKey === "\x1b[1;4C") {
    resizeActive(resizeStep, 0);
    render();
    return;
  } else if (rawKey === "\x1b[1;4D") {
    resizeActive(-resizeStep, 0);
    render();
    return;
  }

  if (activeWindowIndex === 1) {
    if (rawKey === "\x1b[A") {
      selectedElement =
        (selectedElement - 1 + sampleElements.length) % sampleElements.length;
      buttonPressed = false;
      render();
      return;
    } else if (rawKey === "\x1b[B") {
      selectedElement = (selectedElement + 1) % sampleElements.length;
      buttonPressed = false;
      render();
      return;
    }

    if (rawKey === "\r") {
      if (selectedElement === 1) {
        buttonPressed = true;
        render();
        setTimeout(() => {
          buttonPressed = false;
          render();
        }, 500);
      } else if (selectedElement === 2) {
        counter++;
        render();
      }
      return;
    }
  }
});

inputManager.start();
render();

setInterval(() => {
  render();
}, 2000);

// only supports RGB values because it's the only kind of
// color codes I have memorized
export class ColorManager {
  constructor() {
    this.R = 255;
    this.G = 255;
    this.B = 255;
  }

  setColor(R, G, B) {
    this.R = Math.max(0, Math.min(255, R));
    this.G = Math.max(0, Math.min(255, G));
    this.B = Math.max(0, Math.min(255, B));
    return this;
  }

  getColor() {
    return { R: this.R, G: this.G, B: this.B };
  }

  toANSIForeground() {
    return `\x1b[38;2;${this.R};${this.G};${this.B}m`;
  }

  toANSIBackground() {
    return `\x1b[48;2;${this.R};${this.G};${this.B}m`;
  }
  toANSI256() {
    if (this.R === this.G && this.G === this.B) {
      if (this.R < 8) return 16;
      if (this.R > 248) return 231;
      return Math.round(((this.R - 8) / 247) * 24) + 232;
    }

    const r = Math.round((this.R / 255) * 5);
    const g = Math.round((this.G / 255) * 5);
    const b = Math.round((this.B / 255) * 5);
    return 16 + 36 * r + 6 * g + b;
  }

  static reset() {
    return "\x1b[0m";
  }
}

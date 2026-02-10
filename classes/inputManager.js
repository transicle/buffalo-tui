export class InputManager {
    constructor() {
        this.listeners = {};
        this.focusedElement = null;
        this.isListening = false;
        this.keyBuffer = '';
        this.inputHandlers = [];
        this.specialKeys = {
            'up': '\u001b[A',
            'down': '\u001b[B',
            'right': '\u001b[C',
            'left': '\u001b[D',
            'enter': '\r',
            'escape': '\u001b',
            'backspace': '\x7f',
            'tab': '\t'
        };
    }

    start() {
        if (this.isListening) return;

        this.isListening = true;
        this.setupStdin();
    }

    stop() {
        this.isListening = false;
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
        }
        process.stdin.removeAllListeners('data');
    }

    setupStdin() {
        if (!process.stdin.isTTY) {
            console.warn('Warning: InputManager requires TTY mode');
            return;
        }

        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        process.stdin.on('data', (key) => {
            this.handleKeyPress(key);
        });
    }

    handleKeyPress(key) {
        if (key === '\u0003') {
            this.stop();
            process.exit(0);
        }

        this.keyBuffer = key;
        const keyName = this.identifyKey(key);

        if (this.listeners['any']) {
            this.listeners['any'].forEach(callback => callback(keyName, key));
        }

        if (this.listeners[keyName]) {
            this.listeners[keyName].forEach(callback => callback(key));
        }

        if (this.focusedElement && this.focusedElement.handleInput) {
            this.focusedElement.handleInput(keyName, key);
        }

        this.inputHandlers.forEach(handler => {
            if (handler.predicate ? handler.predicate(keyName) : true) {
                handler.callback(keyName, key);
            }
        });
    }

    identifyKey(key) {
        for (let name in this.specialKeys) {
            if (this.specialKeys[name] === key) {
                return name;
            }
        }

        if (key.length === 1) {
            return key;
        }

        return `unknown_${key.charCodeAt(0)}`;
    }

    on(keyName, callback) {
        if (!this.listeners[keyName]) {
            this.listeners[keyName] = [];
        }
        this.listeners[keyName].push(callback);
        return this;
    }

    onAny(callback) {
        return this.on('any', callback);
    }

    off(keyName, callback) {
        if (this.listeners[keyName]) {
            this.listeners[keyName] = this.listeners[keyName].filter(cb => cb !== callback);
        }
        return this;
    }

    addHandler(callback, predicate = null) {
        this.inputHandlers.push({ callback, predicate });
        return this;
    }

    removeHandler(callback) {
        this.inputHandlers = this.inputHandlers.filter(h => h.callback !== callback);
        return this;
    }

    setFocus(element) {
        if (this.focusedElement && this.focusedElement.onBlur) {
            this.focusedElement.onBlur();
        }

        this.focusedElement = element;

        if (element && element.onFocus) {
            element.onFocus();
        }

        return this;
    }

    getFocus() {
        return this.focusedElement;
    }

    clearListeners(keyName = 'all') {
        if (keyName === 'all') {
            this.listeners = {};
        } else {
            delete this.listeners[keyName];
        }
        return this;
    }

    getLastKey() {
        return this.keyBuffer;
    }

    isActive() {
        return this.isListening;
    }
}
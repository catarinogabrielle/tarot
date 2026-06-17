// Mock EventEmitter for react-native
class EventEmitter {
  constructor() {
    this._listeners = {};
  }

  addListener(event, listener) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(listener);
    return {
      remove: () => {
        const index = this._listeners[event].indexOf(listener);
        if (index > -1) {
          this._listeners[event].splice(index, 1);
        }
      },
    };
  }

  removeListener(event, listener) {
    if (!this._listeners[event]) return;
    const index = this._listeners[event].indexOf(listener);
    if (index > -1) {
      this._listeners[event].splice(index, 1);
    }
  }

  removeAllListeners(event) {
    if (event) {
      delete this._listeners[event];
    } else {
      this._listeners = {};
    }
  }

  emit(event, ...args) {
    if (!this._listeners[event]) return;
    this._listeners[event].forEach(listener => listener(...args));
  }

  on(event, listener) {
    return this.addListener(event, listener);
  }

  once(event, listener) {
    const onceListener = (...args) => {
      listener(...args);
      this.removeListener(event, onceListener);
    };
    return this.addListener(event, onceListener);
  }

  listenerCount(event) {
    return this._listeners[event] ? this._listeners[event].length : 0;
  }

  listeners(event) {
    return this._listeners[event] || [];
  }
}

module.exports = EventEmitter;


class CustomStorage {
  private storage: {
    local?: Storage;
    session?: Storage;
  };

  constructor() {
    if (typeof window !== "undefined") {
      this.storage = {
        local: window.localStorage,
        session: window.sessionStorage,
      };
    } else {
      // Fallback for server-side environment
      this.storage = {};
    }
  }

  set<T>(type: "local" | "session", key: string, value: T): void {
    if (!this.storage[type]) return;

    let parsedValue: string | null = null;

    if (typeof value === "string") {
      parsedValue = value;
    } else {
      try {
        parsedValue = JSON.stringify(value);
      } catch (e) {
        console.error("Storage set stringify error:", e);
      }
    }

    if (parsedValue) {
      this.storage[type]?.setItem(key, parsedValue);
    }
  }

  get<T>(type: "local" | "session", key: string): T | string | null {
    if (!this.storage[type]) return null;

    const savedValue = this.storage[type]?.getItem(key);

    if (savedValue) {
      try {
        if (savedValue.startsWith("{") || savedValue.startsWith("[")) {
          return JSON.parse(savedValue) as T;
        }
        return savedValue;
      } catch (e) {
        console.error("Storage get parse error:", e);
        return null;
      }
    }

    return null;
  }

  remove(type: "local" | "session", key: string): void {
    if (!this.storage[type]) return;
    this.storage[type]?.removeItem(key);
  }
}

export default new CustomStorage();

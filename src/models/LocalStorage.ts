class LocalStorage {
    _data: Record<string, string> = {}
    constructor() { }

    setItem(key: string, val: string | number | boolean) {
        this._data[key] = String(val);
    }

    getItem(key: string) {
        return key in this._data ? this._data[key] : ''
    }

    removeItem(key: string) {
        delete this._data[key];
    }

    clear() {
        this._data = {};
    }
}

export default LocalStorage;

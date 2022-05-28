interface IDataStore {
  [key: string]: unknown;
}

class DataStore {
  data: IDataStore;
  constructor() {
    this.data = {};
  }

  get(key: string): unknown {
    return this.data[key];
  }

  set(key: string, value: unknown): void {
    this.data[key] = value;
  }

  has(key: string): boolean {
    return this.data.hasOwnProperty(key);
  }
}

export default DataStore;
export interface IStorage {
  get(name: string): any;
  set(name: string, value: string): any;
  remove(name: string): any;
}

class Storage implements IStorage {
  private storage: any;

  constructor(storage: any) {
    this.storage = storage;
  }

  get(name: string) {
    return this.storage.getItem(name);
  }

  set(name: string, value: string) {
    if (!this.storage.getItem(name)) this.storage.setItem(name, value);
  }

  remove(name: string) {
    if (this.storage.getItem(name)) this.storage.removeItem(name);
  }
}

export default Storage;

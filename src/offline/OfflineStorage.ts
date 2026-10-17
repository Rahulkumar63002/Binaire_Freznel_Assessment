export class OfflineStorage {
  private static readonly PREFIX = 'binaire_freznel_';

  public static getItem<T>(key: string, defaultValue: T): T {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  }

  public static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }

  public static removeItem(key: string): void {
    try {
      localStorage.removeItem(this.PREFIX + key);
    } catch (e) {
      console.warn('Failed to remove from localStorage', e);
    }
  }
}

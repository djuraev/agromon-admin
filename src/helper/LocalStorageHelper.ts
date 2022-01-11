class LocalStorageHelper {

    public static getItem(key: string): any {
        return window.localStorage.getItem(key);
    }

    public static setItem(key: string, value: any) {
        window.localStorage.setItem(key, value);
    }

    public static removeItem(key: string) {
        window.localStorage.removeItem(key);
    }
}

export default LocalStorageHelper;

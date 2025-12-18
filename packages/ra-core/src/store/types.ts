export interface Store {
    setup: () => void;
    teardown: () => void;
    getItem: <T = any>(key: string, defaultValue?: T) => T | undefined;
    setItem: <T = any>(key: string, value: T) => void;
    removeItem: (key: string) => void;
    removeItems: (keyPrefix: string) => void;
    reset: () => void;
    subscribe: (key: string, callback: (value: any) => void) => () => void;
    listItems?: (keyPrefix?: string) => Record<string, unknown>;
}

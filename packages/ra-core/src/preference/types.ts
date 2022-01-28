export interface PreferenceProvider {
    setup: () => void;
    teardown: () => void;
    getPreference: <T = any>(key: string, defaultValue?: T) => T;
    setPreference: <T = any>(key: string, value: T) => void;
    removePreference: (key: string) => void;
    reset: () => void;
    subscribe: (key: string, callback: (value: any) => void) => () => void;
}

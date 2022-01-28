export interface PreferenceProvider {
    setup: () => void;
    teardown: () => void;
    getPreference: (key: string, defaultValue?: any) => any;
    setPreference: (key: string, value: any) => void;
    removePreference: (key: string) => void;
    reset: () => void;
    subscribe: (key: string, callback: (value: any) => void) => () => void;
}

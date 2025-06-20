import {
    type HotkeyCallback,
    type Keys,
    type Options,
    useHotkeys,
} from 'react-hotkeys-hook';

export const KeyboardShortcut = (props: KeyboardShortcutProps) => {
    const { callback, dependencies, keys, options } = props;
    useHotkeys(keys, callback, options, dependencies);
    return null;
};

export interface KeyboardShortcutProps {
    keys: Keys;
    callback: HotkeyCallback;
    options?: Options;
    dependencies?: readonly unknown[];
}

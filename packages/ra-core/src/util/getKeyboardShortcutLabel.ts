import { Keys } from 'react-hotkeys-hook';

export const getKeyboardShortcutLabel = (keyboardShortcut: Keys) => {
    if (typeof keyboardShortcut === 'string') {
        return keyboardShortcut.split('+').join(' + ');
    }
    return keyboardShortcut
        .map(shortcut => getKeyboardShortcutLabel(shortcut))
        .join(', ');
};

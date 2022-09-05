import { createContext, ReactNode } from 'react';

export const PreferencesEditorContext = createContext<
    PreferencesEditorContextValue
>(undefined);

export type PreferencesEditorContextValue = {
    editor: ReactNode | null;
    setEditor: (editor: ReactNode) => void;
    title: string | null;
    setTitle: (path: string) => void;
    isEnabled: boolean;
    enable: () => void;
    disable: () => void;
    path: string | null;
    setPath: (path: string) => void;
};

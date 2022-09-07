import { createContext, ReactNode } from 'react';

export const PreferencesEditorContext = createContext<
    PreferencesEditorContextValue
>(undefined);

export type PreferencesEditorContextValue = {
    editor: ReactNode | null;
    setEditor: (editor: ReactNode) => void;
    preferenceKey?: string;
    setPreferenceKey: (key?: string) => void;
    title: string | null;
    titleOptions?: any;
    setTitle: (title: string, titleOptions?: any) => void;
    isEnabled: boolean;
    enable: () => void;
    disable: () => void;
    path: string | null;
    setPath: (path: string) => void;
};

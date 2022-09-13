import * as React from 'react';
import { createContext, ReactElement } from 'react';

export const PreferencesEditorContext = createContext<
    PreferencesEditorContextValue
>(undefined);

export type PreferencesEditorContextValue = {
    editor: ReactElement | null;
    setEditor: React.Dispatch<React.SetStateAction<ReactElement>>;
    preferenceKey?: string;
    setPreferenceKey: React.Dispatch<React.SetStateAction<string>>;
    title: string | null;
    titleOptions?: any;
    setTitle: (title: string, titleOptions?: any) => void;
    isEnabled: boolean;
    enable: () => void;
    disable: () => void;
    path: string | null;
    setPath: (path: string) => void;
};

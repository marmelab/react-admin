import * as React from 'react';
import { ReactElement, useCallback, useMemo, useState } from 'react';
import {
    PreferencesEditorContext,
    PreferencesEditorContextValue,
} from './PreferencesEditorContext';

export const PreferencesEditorContextProvider = ({ children }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [editor, setEditor] = useState<ReactElement>(null);
    const [preferenceKey, setPreferenceKey] = useState<string>();
    const [path, setPath] = useState<string>(null);
    const [title, setTitleString] = useState<string>(null);
    const [titleOptions, setTitleOptions] = useState<any>();
    const enable = useCallback(() => setIsEnabled(true), []);
    const disable = useCallback(() => {
        setIsEnabled(false);
        setEditor(null);
    }, []);

    const setTitle = useCallback((title: string, titleOptions?: any) => {
        setTitleString(title);
        setTitleOptions(titleOptions);
    }, []);

    const context = useMemo<PreferencesEditorContextValue>(() => {
        return {
            editor,
            setEditor,
            preferenceKey,
            setPreferenceKey,
            title,
            titleOptions,
            setTitle,
            isEnabled,
            disable,
            enable,
            path,
            setPath,
        };
    }, [
        disable,
        enable,
        editor,
        preferenceKey,
        isEnabled,
        path,
        setPath,
        title,
        titleOptions,
        setTitle,
    ]);

    return (
        <PreferencesEditorContext.Provider value={context}>
            {children}
        </PreferencesEditorContext.Provider>
    );
};

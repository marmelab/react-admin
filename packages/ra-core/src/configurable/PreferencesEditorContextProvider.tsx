import * as React from 'react';
import { ReactElement, useCallback, useMemo, useState } from 'react';
import {
    PreferencesEditorContext,
    PreferencesEditorContextValue,
} from './PreferencesEditorContext';

export const PreferencesEditorContextProvider = ({ children }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [editor, setEditor] = useState<ReactElement>(null);
    const [path, setPath] = useState<string>(null);
    const [title, setTitle] = useState<string>(null);
    const enable = useCallback(() => setIsEnabled(true), []);
    const disable = useCallback(() => {
        setIsEnabled(false);
        setEditor(null);
    }, []);

    const context = useMemo<PreferencesEditorContextValue>(() => {
        return {
            editor,
            setEditor,
            title,
            setTitle,
            isEnabled,
            disable,
            enable,
            path,
            setPath,
        };
    }, [disable, enable, editor, isEnabled, path, setPath, title, setTitle]);

    return (
        <PreferencesEditorContext.Provider value={context}>
            {children}
        </PreferencesEditorContext.Provider>
    );
};

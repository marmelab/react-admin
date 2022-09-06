import { useContext } from 'react';
import {
    PreferencesEditorContext,
    PreferencesEditorContextValue,
} from './PreferencesEditorContext';

export const usePreferencesEditor = (): PreferencesEditorContextValue =>
    useContext(PreferencesEditorContext);

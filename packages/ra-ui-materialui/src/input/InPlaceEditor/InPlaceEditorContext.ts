import { createContext } from 'react';

export type InPlaceEditorAction =
    | { type: 'edit' }
    | { type: 'save'; values: any }
    | { type: 'cancel' }
    | { type: 'success' }
    | { type: 'error'; error: any };

export type InPlaceEditorValue =
    | { state: 'editing' }
    | { state: 'saving'; values: any }
    | { state: 'reading' };

type InPlaceEditorContextType = {
    state: InPlaceEditorValue;
    dispatch: (action: InPlaceEditorAction) => void;
};

export const InPlaceEditorContext = createContext<
    InPlaceEditorContextType | undefined
>(undefined);

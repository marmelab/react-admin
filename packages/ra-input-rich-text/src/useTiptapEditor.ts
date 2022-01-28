import { useContext } from 'react';
import { TiptapEditorContext } from './TiptapEditorContext';

export const useTiptapEditor = () => {
    const context = useContext(TiptapEditorContext);

    return context;
};

import * as React from 'react';
import { Editor } from '@tiptap/react';
import { TiptapEditorContext } from './TiptapEditorContext';

export const TiptapEditorProvider = ({
    children,
    value,
}: TiptapEditorProviderProps) => (
    <TiptapEditorContext.Provider value={value}>
        {children}
    </TiptapEditorContext.Provider>
);

export type TiptapEditorProviderProps = {
    children: React.ReactNode;
    value: Editor;
};

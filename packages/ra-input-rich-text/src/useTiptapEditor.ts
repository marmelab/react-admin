import { useContext, useEffect, useState } from 'react';
import { TiptapEditorContext } from './TiptapEditorContext';

export const useTiptapEditor = () => {
    const [ready, setReady] = useState(false);
    const editor = useContext(TiptapEditorContext);

    useEffect(() => {
        const onReady = () => {
            setReady(true);
        };

        if (editor != null) {
            // This ensure support for hot reload
            setReady(editor.isEditable);

            editor.on('create', onReady);
        }

        return () => {
            if (editor != null) {
                editor.off('create', onReady);
            }
        };
    }, [editor]);

    if (ready) {
        return editor;
    }
    return null;
};

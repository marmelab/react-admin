import { useEffect, useState } from 'react';
import { useTiptapEditor } from '../useTiptapEditor';

/**
 * A hook that returns the current text selection in the editor.
 * @returns {(string|null)} The current text selection if any, or null.
 */
export const useEditorSelection = () => {
    const editor = useTiptapEditor();

    const [selection, setSelection] = useState<string | null>(
        editor
            ? editor.state.doc.textBetween(
                  editor.state.selection.from,
                  editor.state.selection.to
              )
            : null
    );

    useEffect(() => {
        const handleSelectionChange = () => {
            setSelection(
                editor
                    ? editor.state.doc.textBetween(
                          editor.state.selection.from,
                          editor.state.selection.to
                      )
                    : null
            );
        };

        if (editor) {
            editor.on('selectionUpdate', handleSelectionChange);
        }

        return () => {
            if (editor) {
                editor.off('selectionUpdate', handleSelectionChange);
            }
        };
    }, [editor]);

    return selection;
};

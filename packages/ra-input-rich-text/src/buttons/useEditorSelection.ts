import { useEditorState } from '@tiptap/react';
import { useTiptapEditor } from '../useTiptapEditor';

/**
 * A hook that returns the current text selection in the editor.
 * @returns {(string|null)} The current text selection if any, or null.
 */
export const useEditorSelection = () => {
    const editor = useTiptapEditor();

    return useEditorState({
        editor,
        selector: ({ editor }) =>
            editor
                ? editor.state.doc.textBetween(
                      editor.state.selection.from,
                      editor.state.selection.to
                  )
                : null,
    });
};

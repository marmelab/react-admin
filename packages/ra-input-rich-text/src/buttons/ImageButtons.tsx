import * as React from 'react';
import { ToggleButton, ToggleButtonProps } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';

export const ImageButtons = (props: Omit<ToggleButtonProps, 'value'>) => {
    const translate = useTranslate();
    const editor = useTiptapEditor();

    const label = translate('ra.tiptap.image', { _: 'Image' });

    const addImage = React.useCallback(() => {
        const url = window.prompt(
            translate('ra.tiptap.image_dialog', { _: 'Image URL' })
        );

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor, translate]);

    return editor ? (
        <ToggleButton
            aria-label={label}
            title={label}
            {...props}
            disabled={!editor?.isEditable}
            value="image"
            onClick={addImage}
        >
            <ImageIcon fontSize="inherit" />
        </ToggleButton>
    ) : null;
};

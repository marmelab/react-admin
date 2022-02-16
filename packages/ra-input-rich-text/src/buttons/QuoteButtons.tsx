import * as React from 'react';
import { ToggleButton, ToggleButtonProps } from '@mui/material';
import FormatQuote from '@mui/icons-material/FormatQuote';
import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';

export const QuoteButtons = (props: Omit<ToggleButtonProps, 'value'>) => {
    const editor = useTiptapEditor();
    const translate = useTranslate();

    const label = translate('ra.tiptap.blockquote', {
        _: 'Blockquote',
    });

    return (
        <ToggleButton
            aria-label={label}
            title={label}
            {...props}
            disabled={!editor?.isEditable}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            selected={editor && editor.isActive('blockquote')}
            value="quote"
        >
            <FormatQuote fontSize="inherit" />
        </ToggleButton>
    );
};

import * as React from 'react';
import { ToggleButton, ToggleButtonGroupProps } from '@mui/material';
import FormatQuote from '@mui/icons-material/FormatQuote';
import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';

export const QuoteButtons = (props: ToggleButtonGroupProps) => {
    const editor = useTiptapEditor();
    const translate = useTranslate();

    const label = translate('ra.tiptap.blockquote', {
        _: 'Blockquote',
    });

    return (
        <ToggleButton
            value="quote"
            aria-label={label}
            title={label}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            selected={editor && editor.isActive('blockquote')}
        >
            <FormatQuote fontSize="inherit" />
        </ToggleButton>
    );
};

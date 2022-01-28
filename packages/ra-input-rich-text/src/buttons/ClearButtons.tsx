import * as React from 'react';
import { ToggleButton, ToggleButtonGroupProps } from '@mui/material';
import FormatClear from '@mui/icons-material/FormatClear';
import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';

export const ClearButtons = (props: ToggleButtonGroupProps) => {
    const editor = useTiptapEditor();
    const translate = useTranslate();

    const label = translate('ra.tiptap.clear_format', {
        _: 'Clear format',
    });

    return (
        <ToggleButton
            value="clear"
            aria-label={label}
            title={label}
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            selected={false}
        >
            <FormatClear fontSize="inherit" />
        </ToggleButton>
    );
};

import * as React from 'react';
import { ToggleButton, ToggleButtonProps } from '@mui/material';
import FormatClear from '@mui/icons-material/FormatClear';
import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';

export interface ClearButtonsProps {
  label?: string;
}

export const ClearButtons = (props: Omit<ToggleButtonProps, 'value'> & ClearButtonsProps) => {
    const editor = useTiptapEditor();
    const translate = useTranslate();

    const label =
        props.label ||
        translate("ra.tiptap.clear_format", {
        _: "Clear format",
        });


    return (
        <ToggleButton
            aria-label={label}
            title={label}
            {...props}
            disabled={!editor?.isEditable}
            value="clear"
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
            <FormatClear fontSize="inherit" />
        </ToggleButton>
    );
};

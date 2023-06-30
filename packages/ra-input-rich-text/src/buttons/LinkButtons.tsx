import * as React from 'react';
import { ToggleButton, ToggleButtonProps } from '@mui/material';
import InsertLink from '@mui/icons-material/InsertLink';

import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';
import { useEditorSelection } from './useEditorSelection';

export interface LinkButtonsProps {
  label?: string;
}


export const LinkButtons = (props: Omit<ToggleButtonProps, 'value'> & LinkButtonsProps) => {
    const editor = useTiptapEditor();
    const translate = useTranslate();
    const currentTextSelection = useEditorSelection();

    const label =
        props.label ||
        translate("ra.tiptap.link", {
        _: "Add a link",
    });

    const handleClick = () => {
        if (!editor.can().setLink({ href: '' })) {
            return;
        }

        const url = window.prompt('URL');

        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
    };

    return (
        <ToggleButton
            aria-label={label}
            title={label}
            {...props}
            disabled={!editor?.isEditable || !currentTextSelection}
            value="link"
            onClick={handleClick}
            selected={editor && editor.isActive('link')}
        >
            <InsertLink fontSize="inherit" />
        </ToggleButton>
    );
};

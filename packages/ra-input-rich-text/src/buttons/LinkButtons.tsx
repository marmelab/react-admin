import * as React from 'react';
import { ToggleButton, ToggleButtonProps } from '@mui/material';
import InsertLink from '@mui/icons-material/InsertLink';

import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';

export const LinkButtons = (props: Omit<ToggleButtonProps, 'value'>) => {
    const editor = useTiptapEditor();
    const translate = useTranslate();
    const disabled = editor
        ? editor.state.doc.textBetween(
              editor.state.selection.from,
              editor.state.selection.to
          ).length === 0
        : false;

    const label = translate('ra.tiptap.link', {
        _: 'Add a link',
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
            disabled={!editor?.isEditable || disabled}
            value="link"
            onClick={handleClick}
            selected={editor && editor.isActive('link')}
        >
            <InsertLink fontSize="inherit" />
        </ToggleButton>
    );
};

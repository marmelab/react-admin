import * as React from 'react';
import { ToggleButton, ToggleButtonGroupProps } from '@mui/material';
import InsertLink from '@mui/icons-material/InsertLink';

import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';

export const LinkButtons = (props: ToggleButtonGroupProps) => {
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

    return (
        <ToggleButton
            value="link"
            aria-label={label}
            title={label}
            onClick={() => {
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
            }}
            selected={editor && editor.isActive('link')}
            disabled={disabled}
        >
            <InsertLink fontSize="inherit" />
        </ToggleButton>
    );
};

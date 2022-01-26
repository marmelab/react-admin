import * as React from 'react';
import { MouseEvent } from 'react';

import { Editor } from '@tiptap/react';
import {
    ToggleButton,
    ToggleButtonGroup,
    ToggleButtonGroupProps,
} from '@mui/material';
import FormatListBulleted from '@mui/icons-material/FormatListBulleted';
import FormatListNumbered from '@mui/icons-material/FormatListNumbered';

import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';

export const ListButtons = (props: ToggleButtonGroupProps) => {
    const editor = useTiptapEditor();
    const translate = useTranslate();

    const bulletListLabel = translate('ra.tiptap.list_bulleted', {
        _: 'Bulleted list',
    });
    const numberListLabel = translate('ra.tiptap.list_numbered', {
        _: 'Numbered list',
    });

    const handleChange = (
        event: MouseEvent<HTMLElement>,
        newFormat: string
    ) => {
        ListValues.forEach(format => {
            const shouldBeDeactivated =
                editor && editor.isActive(format) && newFormat !== format;
            const shouldBeActivated =
                editor && !editor.isActive(format) && newFormat === format;

            if (shouldBeDeactivated || shouldBeActivated) {
                ListActions[format](editor);
            }
        });
    };

    const value = ListValues.reduce((acc, value) => {
        if (editor && editor.isActive(value)) {
            return value;
        }
        return acc;
    }, '');

    return (
        <ToggleButtonGroup
            exclusive
            {...props}
            onChange={handleChange}
            value={value}
        >
            <ToggleButton
                value="bulletList"
                aria-label={bulletListLabel}
                title={bulletListLabel}
            >
                <FormatListBulleted fontSize="inherit" />
            </ToggleButton>
            <ToggleButton
                value="orderedList"
                aria-label={numberListLabel}
                title={numberListLabel}
            >
                <FormatListNumbered fontSize="inherit" />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

const ListValues = ['bulletList', 'orderedList'];
const ListActions = {
    bulletList: (editor: Editor) =>
        editor.chain().focus().toggleBulletList().run(),
    orderedList: (editor: Editor) =>
        editor.chain().focus().toggleOrderedList().run(),
};

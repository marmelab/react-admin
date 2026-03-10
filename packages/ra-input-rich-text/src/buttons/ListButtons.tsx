import * as React from 'react';
import { MouseEvent, useEffect, useState } from 'react';

import { findParentNode } from '@tiptap/core';
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

    const [value, setValue] = useState<string>();

    const handleChange = (
        event: MouseEvent<HTMLElement>,
        newFormat: string
    ) => {
        if (!editor) {
            return;
        }
        if (newFormat) {
            ListActions[newFormat](editor);
            return;
        }
        // Unclicking the active button — toggle off the innermost list
        const innermostList = getInnermostListType(editor);
        if (innermostList) {
            ListActions[innermostList](editor);
        }
    };

    useEffect(() => {
        const handleUpdate = () => {
            setValue(editor ? getInnermostListType(editor) : undefined);
        };

        if (editor) {
            editor.on('update', handleUpdate);
            editor.on('selectionUpdate', handleUpdate);
        }

        return () => {
            if (editor) {
                editor.off('update', handleUpdate);
                editor.off('selectionUpdate', handleUpdate);
            }
        };
    }, [editor]);

    return (
        <ToggleButtonGroup
            {...props}
            disabled={!editor?.isEditable}
            exclusive
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

const getInnermostListType = (editor: Editor): string | undefined => {
    const { selection } = editor.state;
    const parentList = findParentNode(node =>
        ListValues.includes(node.type.name)
    )(selection);
    return parentList?.node.type.name;
};

const ListActions = {
    bulletList: (editor: Editor) =>
        editor.chain().focus().toggleBulletList().run(),
    orderedList: (editor: Editor) =>
        editor.chain().focus().toggleOrderedList().run(),
};

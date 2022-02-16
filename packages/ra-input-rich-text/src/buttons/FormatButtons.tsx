import * as React from 'react';
import { MouseEvent } from 'react';

import { Editor } from '@tiptap/react';
import {
    ToggleButton,
    ToggleButtonGroup,
    ToggleButtonGroupProps,
} from '@mui/material';
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import FormatUnderlined from '@mui/icons-material/FormatUnderlined';
import FormatStrikethrough from '@mui/icons-material/FormatStrikethrough';
import Code from '@mui/icons-material/Code';
import { useTranslate } from 'ra-core';
import { useTiptapEditor } from '../useTiptapEditor';

export const FormatButtons = (props: ToggleButtonGroupProps) => {
    const editor = useTiptapEditor();
    const translate = useTranslate();

    const boldLabel = translate('ra.tiptap.bold', {
        _: 'Bold',
    });

    const italicLabel = translate('ra.tiptap.Italic', {
        _: 'Italic',
    });

    const underlineLabel = translate('ra.tiptap.underline', {
        _: 'Underline',
    });

    const strikeLabel = translate('ra.tiptap.strike', {
        _: 'Strikethrough',
    });

    const codeLabel = translate('ra.tiptap.code', {
        _: 'Code',
    });

    const handleChange = (
        event: MouseEvent<HTMLElement>,
        newFormats: string[]
    ) => {
        FormatValues.forEach(format => {
            const shouldBeDeactivated =
                editor &&
                editor.isActive(format) &&
                !newFormats.includes(format);
            const shouldBeActivated =
                editor &&
                !editor.isActive(format) &&
                newFormats.includes(format);

            if (shouldBeDeactivated || shouldBeActivated) {
                FormatActions[format](editor);
            }
        });
    };

    const value = FormatValues.reduce((acc, value) => {
        if (editor && editor.isActive(value)) {
            acc.push(value);
        }
        return acc;
    }, []);

    return (
        <ToggleButtonGroup
            {...props}
            disabled={!editor?.isEditable}
            onChange={handleChange}
            value={value}
        >
            <ToggleButton
                value="bold"
                aria-label={boldLabel}
                title={boldLabel}
                selected={editor && editor.isActive('bold')}
            >
                <FormatBold fontSize="inherit" />
            </ToggleButton>
            <ToggleButton
                value="italic"
                aria-label={italicLabel}
                title={italicLabel}
                selected={editor && editor.isActive('italic')}
            >
                <FormatItalic fontSize="inherit" />
            </ToggleButton>
            <ToggleButton
                value="underline"
                aria-label={underlineLabel}
                title={underlineLabel}
                selected={editor && editor.isActive('underline')}
            >
                <FormatUnderlined fontSize="inherit" />
            </ToggleButton>
            <ToggleButton
                value="strike"
                aria-label={strikeLabel}
                title={strikeLabel}
                selected={editor && editor.isActive('strike')}
            >
                <FormatStrikethrough fontSize="inherit" />
            </ToggleButton>
            <ToggleButton
                value="code"
                aria-label={codeLabel}
                title={codeLabel}
                selected={editor && editor.isActive('code')}
            >
                <Code fontSize="inherit" />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

const FormatValues = ['bold', 'italic', 'underline', 'strike', 'code'];

const FormatActions = {
    bold: (editor: Editor) => editor.chain().focus().toggleBold().run(),
    italic: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
    underline: (editor: Editor) =>
        editor.chain().focus().toggleUnderline().run(),
    strike: (editor: Editor) => editor.chain().focus().toggleStrike().run(),
    code: (editor: Editor) => editor.chain().focus().toggleCode().run(),
};

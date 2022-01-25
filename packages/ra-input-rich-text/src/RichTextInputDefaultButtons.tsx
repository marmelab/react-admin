import * as React from 'react';
import {
    ToggleButton,
    ToggleButtonGroup,
    ToggleButtonGroupProps,
} from '@mui/material';
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import FormatUnderlined from '@mui/icons-material/FormatUnderlined';
import FormatStrikethrough from '@mui/icons-material/FormatStrikethrough';
import FormatListBulleted from '@mui/icons-material/FormatListBulleted';
import FormatListNumbered from '@mui/icons-material/FormatListNumbered';
import FormatAlignCenter from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeft from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRight from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustify from '@mui/icons-material/FormatAlignJustify';
import FormatQuote from '@mui/icons-material/FormatQuote';
import FormatClear from '@mui/icons-material/FormatClear';
import InsertLink from '@mui/icons-material/InsertLink';
import Code from '@mui/icons-material/Code';
import { useTranslate } from 'ra-core';
import { useTiptapEditor } from './useTiptapEditor';

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

    return (
        <ToggleButtonGroup {...props}>
            <ToggleButton
                value="bold"
                aria-label={boldLabel}
                title={boldLabel}
                onClick={() => editor.chain().focus().toggleBold().run()}
                selected={editor && editor.isActive('bold')}
            >
                <FormatBold fontSize="inherit" />
            </ToggleButton>
            <ToggleButton
                value="italic"
                aria-label={italicLabel}
                title={italicLabel}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                selected={editor && editor.isActive('italic')}
            >
                <FormatItalic fontSize="inherit" />
            </ToggleButton>
            <ToggleButton
                value="underline"
                aria-label={underlineLabel}
                title={underlineLabel}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                selected={editor && editor.isActive('underline')}
            >
                <FormatUnderlined fontSize="inherit" />
            </ToggleButton>
            <ToggleButton
                value="strike"
                aria-label={strikeLabel}
                title={strikeLabel}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                selected={editor && editor.isActive('strike')}
            >
                <FormatStrikethrough fontSize="inherit" />
            </ToggleButton>
            <ToggleButton
                value="code"
                aria-label={codeLabel}
                title={codeLabel}
                onClick={() => editor.chain().focus().toggleCode().run()}
                selected={editor && editor.isActive('code')}
            >
                <Code fontSize="inherit" />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export const ListButtons = (props: ToggleButtonGroupProps) => {
    const editor = useTiptapEditor();
    const translate = useTranslate();

    const bulletListLabel = translate('ra.tiptap.list_bulleted', {
        _: 'Bulleted list',
    });
    const numberListLabel = translate('ra.tiptap.list_numbered', {
        _: 'Numbered list',
    });
    return (
        <ToggleButtonGroup {...props}>
            <ToggleButton
                value="bulleted"
                aria-label={bulletListLabel}
                title={bulletListLabel}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                selected={editor && editor.isActive('bulletList')}
            >
                <FormatListBulleted fontSize="inherit" />
            </ToggleButton>
            <ToggleButton
                value="numbered"
                aria-label={numberListLabel}
                title={numberListLabel}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                selected={editor && editor.isActive('orderedList')}
            >
                <FormatListNumbered fontSize="inherit" />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export const AlignmentButtons = (props: ToggleButtonGroupProps) => {
    const editor = useTiptapEditor();
    const translate = useTranslate();

    const leftLabel = translate('ra.tiptap.align_left', { _: 'Align left' });
    const rightLabel = translate('ra.tiptap.align_right', { _: 'Align right' });
    const centerLabel = translate('ra.tiptap.align_center', { _: 'Center' });
    const justifyLabel = translate('ra.tiptap.align_justify', { _: 'Justify' });

    return (
        <ToggleButtonGroup {...props}>
            <ToggleButton
                value="align-left"
                aria-label={leftLabel}
                title={leftLabel}
                onClick={() =>
                    editor.chain().focus().setTextAlign('left').run()
                }
                selected={editor && editor.isActive({ textAlign: 'left' })}
            >
                <FormatAlignLeft fontSize="inherit" />
            </ToggleButton>
            <ToggleButton
                value="align-center"
                aria-label={centerLabel}
                title={centerLabel}
                onClick={() =>
                    editor.chain().focus().setTextAlign('center').run()
                }
                selected={editor && editor.isActive({ textAlign: 'center' })}
            >
                <FormatAlignCenter fontSize="inherit" />
            </ToggleButton>
            <ToggleButton
                value="align-right"
                aria-label={rightLabel}
                title={rightLabel}
                onClick={() =>
                    editor.chain().focus().setTextAlign('right').run()
                }
                selected={editor && editor.isActive({ textAlign: 'right' })}
            >
                <FormatAlignRight fontSize="inherit" />
            </ToggleButton>
            <ToggleButton
                value="align-justify"
                aria-label={justifyLabel}
                title={justifyLabel}
                onClick={() =>
                    editor.chain().focus().setTextAlign('justify').run()
                }
                selected={editor && editor.isActive({ textAlign: 'justify' })}
            >
                <FormatAlignJustify fontSize="inherit" />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

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
        <ToggleButtonGroup {...props}>
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
        </ToggleButtonGroup>
    );
};

export const QuoteButtons = (props: ToggleButtonGroupProps) => {
    const editor = useTiptapEditor();
    const translate = useTranslate();

    const label = translate('ra.tiptap.blockquote', {
        _: 'Blockquote',
    });

    return (
        <ToggleButtonGroup {...props}>
            <ToggleButton
                value="quote"
                aria-label={label}
                title={label}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                selected={editor && editor.isActive('blockquote')}
            >
                <FormatQuote fontSize="inherit" />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export const ClearButtons = (props: ToggleButtonGroupProps) => {
    const editor = useTiptapEditor();
    const translate = useTranslate();

    const label = translate('ra.tiptap.clear_format', {
        _: 'Clear format',
    });

    return (
        <ToggleButtonGroup {...props}>
            <ToggleButton
                value="clear"
                aria-label={label}
                title={label}
                onClick={() => editor.chain().focus().unsetAllMarks().run()}
                selected={false}
            >
                <FormatClear fontSize="inherit" />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

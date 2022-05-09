import * as React from 'react';
import { ReactElement, ReactNode, useEffect } from 'react';
import clsx from 'clsx';
import { useEditor, Editor, EditorOptions, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useInput, useResourceContext } from 'ra-core';
import {
    CommonInputProps,
    InputHelperText,
    Labeled,
    LabeledProps,
} from 'ra-ui-materialui';
import { TiptapEditorProvider } from './TiptapEditorProvider';
import { RichTextInputToolbar } from './RichTextInputToolbar';

/**
 * A rich text editor for the react-admin that is accessible and supports translations. Based on [Tiptap](https://www.tiptap.dev/).
 * @param props The input props. Accept all common react-admin input props.
 * @param {EditorOptions} props.editorOptions The options to pass to the Tiptap editor.
 * @param {ReactNode} props.toolbar The toolbar containing the editors commands.
 *
 * @example <caption>Customizing the editors options</caption>
 * import { RichTextInput, RichTextInputToolbar } from 'ra-input-rich-text';
 * const MyRichTextInput = (props) => (
 *     <RichTextInput
 *         toolbar={<RichTextInputToolbar size="large" />}
 *         label="Body"
 *         source="body"
 *         {...props}
 *     />
 * );
 *
 * @example <caption>Customizing the toolbar size</caption>
 * import { RichTextInput, RichTextInputToolbar } from 'ra-input-rich-text';
 * const MyRichTextInput = (props) => (
 *     <RichTextInput
 *         toolbar={<RichTextInputToolbar size="large" />}
 *         label="Body"
 *         source="body"
 *         {...props}
 *     />
 * );
 *
 * @example <caption>Customizing the toolbar commands</caption>
 * import { RichTextInput, RichTextInputToolbar } from 'ra-input-rich-text';
 * const MyRichTextInput = ({ size, ...props }) => (
 *     <RichTextInput
 *         toolbar={(
 *             <RichTextInputToolbar>
 *                 <LevelSelect size={size} />
 *                 <FormatButtons size={size} />
 *                 <ListButtons size={size} />
 *                 <LinkButtons size={size} />
 *                 <QuoteButtons size={size} />
 *                 <ClearButtons size={size} />
 *             </RichTextInputToolbar>
 *         )}
 *         label="Body"
 *         source="body"
 *         {...props}
 *     />
 * );
 */
export const RichTextInput = (props: RichTextInputProps) => {
    const {
        className,
        defaultValue = '',
        disabled = false,
        editorOptions = DefaultEditorOptions,
        fullWidth,
        helperText,
        label,
        readOnly = false,
        source,
        toolbar,
    } = props;

    const resource = useResourceContext(props);
    const {
        id,
        field,
        isRequired,
        fieldState,
        formState: { isSubmitted },
    } = useInput({ ...props, source, defaultValue });

    const editor = useEditor({
        ...editorOptions,
        editable: !disabled && !readOnly,
        content: field.value,
        editorProps: {
            attributes: {
                id,
            },
        },
    });

    const { error, invalid, isTouched } = fieldState;

    useEffect(() => {
        if (!editor) return;

        editor.setOptions({
            editable: !disabled && !readOnly,
            editorProps: {
                attributes: {
                    id,
                },
            },
        });
    }, [disabled, editor, readOnly, id]);

    useEffect(() => {
        if (!editor) {
            return;
        }

        const handleEditorUpdate = () => {
            if (editor.isEmpty) {
                field.onChange('');
                field.onBlur();
                return;
            }

            const html = editor.getHTML();
            field.onChange(html);
            field.onBlur();
        };

        editor.on('update', handleEditorUpdate);
        return () => {
            editor.off('update', handleEditorUpdate);
        };
    }, [editor, field]);

    return (
        <Labeled
            isRequired={isRequired}
            label={label}
            id={`${id}-label`}
            color={fieldState?.invalid ? 'error' : undefined}
            source={source}
            resource={resource}
            fullWidth={fullWidth}
        >
            <RichTextInputContent
                className={clsx('ra-input', `ra-input-${source}`, className)}
                editor={editor}
                error={error}
                helperText={helperText}
                id={id}
                isTouched={isTouched}
                isSubmitted={isSubmitted}
                invalid={invalid}
                toolbar={toolbar || <RichTextInputToolbar />}
            />
        </Labeled>
    );
};

/**
 * Extracted in a separate component so that we can remove fullWidth from the props injected by Labeled
 * and avoid warnings about unknown props on Root.
 */
const RichTextInputContent = ({
    className,
    editor,
    error,
    fullWidth,
    helperText,
    id,
    isTouched,
    isSubmitted,
    invalid,
    toolbar,
}: RichTextInputContentProps) => (
    <Root className={className}>
        <TiptapEditorProvider value={editor}>
            {toolbar}
            <EditorContent
                aria-labelledby={`${id}-label`}
                className={classes.editorContent}
                editor={editor}
            />
        </TiptapEditorProvider>
        <FormHelperText
            className={
                (isTouched || isSubmitted) && invalid
                    ? 'ra-rich-text-input-error'
                    : ''
            }
            error={(isTouched || isSubmitted) && invalid}
        >
            <InputHelperText
                touched={isTouched || isSubmitted}
                error={error?.message}
                helperText={helperText}
            />
        </FormHelperText>
    </Root>
);

export const DefaultEditorOptions = {
    extensions: [
        StarterKit,
        Underline,
        Link,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
    ],
};

const PREFIX = 'RaRichTextInput';
const classes = {
    editorContent: `${PREFIX}-editorContent`,
};
const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    [`& .${classes.editorContent}`]: {
        width: '100%',
        '& .ProseMirror': {
            backgroundColor: theme.palette.background.default,
            borderColor:
                theme.palette.mode === 'light'
                    ? 'rgba(0, 0, 0, 0.23)'
                    : 'rgba(255, 255, 255, 0.23)',
            borderRadius: theme.shape.borderRadius,
            borderStyle: 'solid',
            borderWidth: '1px',
            padding: theme.spacing(1),

            '&[contenteditable="false"], &[contenteditable="false"]:hover, &[contenteditable="false"]:focus': {
                backgroundColor: theme.palette.action.disabledBackground,
            },

            '&:hover': {
                backgroundColor: theme.palette.action.hover,
            },
            '&:focus': {
                backgroundColor: theme.palette.background.default,
            },
            '& p': {
                margin: '0 0 1em 0',
                '&:last-child': {
                    marginBottom: 0,
                },
            },
        },
    },
}));

export type RichTextInputProps = CommonInputProps &
    Omit<LabeledProps, 'children'> & {
        disabled?: boolean;
        readOnly?: boolean;
        editorOptions?: Partial<EditorOptions>;
        toolbar?: ReactNode;
    };

export type RichTextInputContentProps = {
    className?: string;
    editor?: Editor;
    error?: any;
    fullWidth?: boolean;
    helperText?: string | ReactElement | false;
    id: string;
    isTouched: boolean;
    isSubmitted: boolean;
    invalid: boolean;
    toolbar?: ReactNode;
};

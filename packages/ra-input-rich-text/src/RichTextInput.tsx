import debounce from 'lodash/debounce';
import React, { useRef, useEffect, useCallback, ComponentProps } from 'react';
import Quill, { QuillOptionsStatic } from 'quill';
import { useInput, FieldTitle } from 'ra-core';
import { InputHelperText } from 'ra-ui-materialui';
import {
    FormHelperText,
    FormControl,
    InputLabel,
    styled,
    GlobalStyles,
} from '@mui/material';
import PropTypes from 'prop-types';

import { RaRichTextClasses, RaRichTextStyles } from './styles';
import QuillSnowStylesheet from './QuillSnowStylesheet';

export const RichTextInput = (props: RichTextInputProps) => {
    const {
        options = {}, // Quill editor options
        toolbar = true,
        fullWidth = true,
        configureQuill,
        helperText,
        label,
        source,
        resource,
        variant,
        margin = 'dense',
        ...rest
    } = props;
    const quillInstance = useRef<Quill>();
    const divRef = useRef<HTMLDivElement>();
    const editor = useRef<HTMLElement>();

    const {
        id,
        isRequired,
        field: { value, onChange },
        fieldState: { invalid, isTouched, error },
        formState: { isSubmitted },
    } = useInput({ source, ...rest });

    const lastValueChange = useRef(value);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onTextChange = useCallback(
        debounce(() => {
            const value =
                editor.current.innerHTML === '<p><br></p>'
                    ? ''
                    : editor.current.innerHTML;

            if (lastValueChange.current !== value) {
                lastValueChange.current = value;
                onChange(value);
            }
        }, 500),
        [onChange]
    );

    useEffect(() => {
        quillInstance.current = new Quill(divRef.current, {
            modules: { toolbar, clipboard: { matchVisual: false } },
            theme: 'snow',
            ...options,
        });

        if (configureQuill) {
            configureQuill(quillInstance.current);
        }

        quillInstance.current.setContents(
            quillInstance.current.clipboard.convert(value)
        );

        editor.current = divRef.current.querySelector('.ql-editor');
        quillInstance.current.on('text-change', onTextChange);

        return () => {
            quillInstance.current.off('text-change', onTextChange);
            if (onTextChange.cancel) {
                onTextChange.cancel();
            }
            quillInstance.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (lastValueChange.current !== value) {
            const selection = quillInstance.current.getSelection();
            quillInstance.current.setContents(
                quillInstance.current.clipboard.convert(value)
            );
            if (selection && quillInstance.current.hasFocus()) {
                quillInstance.current.setSelection(selection);
            }
        }
    }, [value]);

    return (
        <StyledFormControl
            error={isTouched && invalid}
            fullWidth={fullWidth}
            className={`ra-rich-text-input ${RaRichTextClasses.root}`}
            margin={margin}
        >
            {/* @ts-ignore */}
            <GlobalStyles styles={QuillSnowStylesheet} />
            <InputLabel shrink htmlFor={id} className={RaRichTextClasses.label}>
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            </InputLabel>
            <div data-testid="quill" ref={divRef} className={variant} />
            <FormHelperText
                error={(isTouched || isSubmitted) && invalid}
                className={
                    (isTouched || isSubmitted) && invalid
                        ? 'ra-rich-text-input-error'
                        : ''
                }
            >
                <InputHelperText
                    error={error?.message}
                    helperText={helperText}
                    touched={isTouched || isSubmitted}
                />
            </FormHelperText>
        </StyledFormControl>
    );
};

export interface RichTextInputProps {
    debounce?: number;
    label?: string | false;
    options?: QuillOptionsStatic;
    source: string;
    toolbar?:
        | boolean
        | string[]
        | Array<any>[]
        | string
        | {
              container: string | string[] | Array<any>[];
              handlers?: Record<string, Function>;
          };
    fullWidth?: boolean;
    configureQuill?: (instance: Quill) => void;
    helperText?: ComponentProps<typeof InputHelperText>['helperText'];
    record?: Record<any, any>;
    resource?: string;
    variant?: string;
    margin?: 'normal' | 'none' | 'dense';
    [key: string]: any;
}

RichTextInput.propTypes = {
    // @ts-ignore
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    options: PropTypes.object,
    source: PropTypes.string,
    fullWidth: PropTypes.bool,
    configureQuill: PropTypes.func,
};

const StyledFormControl = styled(FormControl)(RaRichTextStyles);

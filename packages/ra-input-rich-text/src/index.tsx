import debounce from 'lodash/debounce';
import React, {
    useRef,
    useEffect,
    useCallback,
    FunctionComponent,
    ComponentProps,
} from 'react';
import Quill, { QuillOptionsStatic } from 'quill';
import { useInput, FieldTitle } from 'ra-core';
import { InputHelperText } from 'ra-ui-materialui';
import {
    FormHelperText,
    FormControl,
    InputLabel,
    PropTypes as MuiPropTypes,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import styles from './styles';

const useStyles = makeStyles(styles, { name: 'RaRichTextInput' });

interface Props {
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
    margin?: MuiPropTypes.Margin;
    [key: string]: any;
}

const RichTextInput: FunctionComponent<Props> = props => {
    const {
        options = {}, // Quill editor options
        toolbar = true,
        fullWidth = true,
        classes: classesOverride,
        configureQuill,
        helperText,
        label,
        source,
        resource,
        variant,
        margin = 'dense',
        ...rest
    } = props;
    const classes = useStyles(props);
    const quillInstance = useRef<Quill>();
    const divRef = useRef<HTMLDivElement>();
    const editor = useRef<HTMLElement>();

    const {
        id,
        isRequired,
        input: { value, onChange },
        meta: { touched, error },
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
        <FormControl
            error={!!(touched && error)}
            fullWidth={fullWidth}
            className="ra-rich-text-input"
            margin={margin}
        >
            <InputLabel shrink htmlFor={id} className={classes.label}>
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            </InputLabel>
            <div data-testid="quill" ref={divRef} className={variant} />
            <FormHelperText
                error={!!error}
                className={!!error ? 'ra-rich-text-input-error' : ''}
            >
                <InputHelperText
                    error={error}
                    helperText={helperText}
                    touched={touched}
                />
            </FormHelperText>
        </FormControl>
    );
};

RichTextInput.propTypes = {
    // @ts-ignore
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    options: PropTypes.object,
    source: PropTypes.string,
    fullWidth: PropTypes.bool,
    configureQuill: PropTypes.func,
};

export default RichTextInput;

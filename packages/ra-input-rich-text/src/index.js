import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';
import { addField, FieldTitle } from 'ra-core';
import { InputHelperText } from 'ra-ui-materialui';
import { FormHelperText, FormControl, InputLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import styles from './styles';

export class RichTextInput extends Component {
    lastValueChange = null;

    static propTypes = {
        addLabel: PropTypes.bool.isRequired,
        classes: PropTypes.object,
        input: PropTypes.object,
        label: PropTypes.string,
        meta: PropTypes.object,
        options: PropTypes.object,
        source: PropTypes.string,
        toolbar: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.bool,
            PropTypes.shape({
                container: PropTypes.array,
                handlers: PropTypes.object,
            }),
        ]),
        fullWidth: PropTypes.bool,
    };

    static defaultProps = {
        addLabel: true,
        options: {}, // Quill editor options
        record: {},
        toolbar: true,
        fullWidth: true,
    };

    componentDidMount() {
        const {
            input: { value },
            toolbar,
            options,
        } = this.props;

        this.quill = new Quill(this.divRef, {
            modules: { toolbar, clipboard: { matchVisual: false } },
            theme: 'snow',
            ...options,
        });

        this.quill.setContents(this.quill.clipboard.convert(value));

        this.editor = this.divRef.querySelector('.ql-editor');
        this.quill.on('text-change', this.onTextChange);
    }

    componentDidUpdate() {
        if (this.lastValueChange !== this.props.input.value) {
            const selection = this.quill.getSelection();
            this.quill.setContents(
                this.quill.clipboard.convert(this.props.input.value)
            );
            if (selection && this.quill.hasFocus()) {
                this.quill.setSelection(selection);
            }
        }
    }

    componentWillUnmount() {
        this.quill.off('text-change', this.onTextChange);
        this.onTextChange.cancel();
        this.quill = null;
    }

    onTextChange = debounce(() => {
        const value =
            this.editor.innerHTML === '<p><br></p>'
                ? ''
                : this.editor.innerHTML;
        this.lastValueChange = value;
        this.props.input.onChange(value);
    }, 500);

    updateDivRef = ref => {
        this.divRef = ref;
    };

    render() {
        const { label, source, resource, isRequired, id, classes } = this.props;
        const { touched, error, helperText = false } = this.props.meta;
        return (
            <FormControl
                error={!!(touched && error)}
                fullWidth={this.props.fullWidth}
                className="ra-rich-text-input"
                margin="dense"
            >
                <InputLabel shrink htmlFor={id} className={classes.label}>
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                </InputLabel>
                <div data-testid="quill" ref={this.updateDivRef} />
                <FormHelperText
                    error={!!error}
                    className={!!error ? 'ra-rich-text-input-error' : ''}
                >
                    {helperText || (touched && error) ? (
                        <InputHelperText
                            error={error}
                            helperText={helperText}
                            touched={touched}
                        />
                    ) : null}
                </FormHelperText>
            </FormControl>
        );
    }
}

const RichTextInputWithField = addField(withStyles(styles)(RichTextInput));

RichTextInputWithField.defaultProps = {
    fullWidth: true,
};
export default RichTextInputWithField;

import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';
import { addField } from 'ra-core';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';

import styles from './styles';

export class RichTextInput extends Component {
    static propTypes = {
        addLabel: PropTypes.bool.isRequired,
        classes: PropTypes.object,
        input: PropTypes.object,
        label: PropTypes.string,
        meta: PropTypes.object,
        options: PropTypes.object,
        source: PropTypes.string,
        toolbar: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
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
        this.quill.on('text-change', debounce(this.onTextChange, 500));
    }

    componentWillUnmount() {
        this.quill.off('text-change', this.onTextChange);
        this.quill = null;
    }

    onTextChange = () => {
        const value =
            this.editor.innerHTML == '<p><br></p>' ? '' : this.editor.innerHTML;
        this.props.input.onChange(value);
    };

    updateDivRef = ref => {
        this.divRef = ref;
    };

    render() {
        const { error, helperText = false } = this.props.meta;
        return (
            <FormControl
                error={error !== null && error != undefined}
                fullWidth={this.props.fullWidth}
                className="ra-rich-text-input"
            >
                <div ref={this.updateDivRef} />
                {error && <FormHelperText error>{error}</FormHelperText>}
                {helperText && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
        );
    }
}

const RichRextInputWithField = addField(withStyles(styles)(RichTextInput));

RichRextInputWithField.defaultProps = {
    addLabel: true,
    fullWidth: true,
};
export default RichRextInputWithField;

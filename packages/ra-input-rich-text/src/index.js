import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';
import { addField } from 'react-admin';
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
        options: PropTypes.object,
        source: PropTypes.string,
        toolbar: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
    };

    static defaultProps = {
        addLabel: true,
        options: {},
        record: {},
        toolbar: true,
    };

    componentDidMount() {
        const {
            input: { value },
            toolbar,
        } = this.props;

        this.quill = new Quill(this.divRef, {
            modules: { toolbar },
            theme: 'snow',
        });

        this.quill.pasteHTML(value);

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
            <FormControl error={error} className="ra-rich-text-input">
                <div ref={this.updateDivRef} />
                {error && <FormHelperText>{error}</FormHelperText>}
                {helperText && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
        );
    }
}

const RichRextInputWithField = addField(withStyles(styles)(RichTextInput));

RichRextInputWithField.defaultProps = {
    addLabel: true,
};
export default RichRextInputWithField;

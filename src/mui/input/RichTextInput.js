import debounce from 'lodash.debounce';
import React, { Component, PropTypes } from 'react';
import Quill from 'quill';

require('./RichTextInput.css');

class RichTextInput extends Component {
    componentDidMount() {
        const {
            input: {
                value,
            },
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
        this.props.input.onChange(this.editor.innerHTML);
    }

    updateDivRef = ref => {
        this.divRef = ref;
    }

    render() {
        return <div ref={this.updateDivRef} />;
    }
}

RichTextInput.propTypes = {
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    options: PropTypes.object,
    requiresField: PropTypes.bool.isRequired,
    source: PropTypes.string,
    toolbar: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.bool,
    ]),
};

RichTextInput.defaultProps = {
    includesLabel: false,
    options: {},
    record: {},
    requiresField: true,
    toolbar: true,
};

export default RichTextInput;

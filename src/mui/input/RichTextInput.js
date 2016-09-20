import debounce from 'lodash.debounce';
import React, { Component, PropTypes } from 'react';
import Quill from 'quill';

require('./RichTextInput.css');

class RichTextInput extends Component {
    componentDidMount() {
        this.quill = new Quill(this.divRef, {
            modules: {
                toolbar: true,
            },
            theme: 'snow',
        });

        const { record, source } = this.props;
        this.quill.pasteHTML(record[source]);

        this.editor = this.divRef.querySelector('.ql-editor');
        this.quill.on('text-change', debounce(this.onTextChange, 500));
    }

    componentWillUnmount() {
        this.quill.off('text-change', this.onTextChange);
        this.quill = null;
    }

    onTextChange = () => {
        if (!this.editor) {
            return;
        }

        this.props.onChange(this.props.source, this.editor.innerHTML);
    }

    render() {
        return <div ref={(ref) => { this.divRef = ref; }} />;
    }
}

RichTextInput.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    options: PropTypes.object,
    onChange: PropTypes.func,
    includesLabel: PropTypes.bool.isRequired,
};

RichTextInput.defaultProps = {
    record: {},
    options: {},
    includesLabel: false,
};

export default RichTextInput;

import debounce from 'lodash.debounce';
import React, { Component, PropTypes } from 'react';
import Quill from 'quill';

require('./RichTextInput.css');

class RichTextInput extends Component {
    componentDidMount() {
        const { toolbar } = this.props;
        this.quill = new Quill(this.divRef, {
            modules: { toolbar },
            theme: 'snow',
        });

        const { record, source } = this.props;
        this.quill.pasteHTML(record[source]);

        this.editor = this.divRef.querySelector('.ql-editor');
        this.quill.on('text-change', debounce(this.onTextChange, 500));
    }

    componentWillUpdate(nextProps) {
        const { record, source } = nextProps;
        this.quill.pasteHTML(record[source]);
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

    updateDivRef = ref => {
        this.divRef = ref;
    }

    render() {
        return <div ref={updateDivRef} />;
    }
}

RichTextInput.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    options: PropTypes.object,
    onChange: PropTypes.func,
    includesLabel: PropTypes.bool.isRequired,
    toolbar: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.bool,
    ]),
};

RichTextInput.defaultProps = {
    record: {},
    options: {},
    includesLabel: false,
    toolbar: true,
};

export default RichTextInput;

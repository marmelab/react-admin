import React, { Component, PropTypes } from 'react';
import Quill from 'quill';

require('./WysiwygInput.css');

class WysiwygInput extends Component {
    init(container) {
        if (!container || this.quill) {
            return;
        }

        this.quill = new Quill(container, {
            modules: {
                toolbar: true,
            },
            theme: 'snow',
        });
    }

    handleChange(newContent) {
        this.props.onChange(this.props.source, newContent);
    }

    render() {
        return (<div>
            <div ref={::this.init} />
        </div>);
    }
}

WysiwygInput.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    options: PropTypes.object,
    onChange: PropTypes.func,
    includesLabel: PropTypes.bool.isRequired,
};

WysiwygInput.defaultProps = {
    record: {},
    options: {},
    includesLabel: false,
};

export default WysiwygInput;

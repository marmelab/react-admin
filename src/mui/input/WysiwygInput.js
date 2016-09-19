import React, { Component, PropTypes } from 'react';
import Quill from 'quill';

const labelStyle = {
    color: 'rgba(0, 0, 0, 0.498039)',
    fontSize: '12px',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 'normal',
};

require('quill/dist/quill.snow.css');

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
        const { label } = this.props;

        return (<div>
            <p style={labelStyle}>{label}</p>
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
    includesLabel: true,
};

export default WysiwygInput;

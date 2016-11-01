import React, { PropTypes } from 'react';
import get from 'lodash.get';

export const removeTags = input => input.replace(/<[^>]+>/gm, '');

const RichTextField = ({ source, record = {}, stripTags, style }) => {
    const value = get(record, source);
    if (stripTags) {
        return <div style={style}>{removeTags(value)}</div>;
    }

    return <div style={style} dangerouslySetInnerHTML={{ __html: value }}></div>;
};

RichTextField.defaultProps = {
    stripTags: false,
};

RichTextField.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    stripTags: PropTypes.bool,
    style: PropTypes.object,
};

export default RichTextField;

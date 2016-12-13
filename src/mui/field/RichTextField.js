import React, { PropTypes } from 'react';
import get from 'lodash.get';

export const removeTags = input => input.replace(/<[^>]+>/gm, '');

const RichTextField = ({ source, record = {}, stripTags, elStyle }) => {
    const value = get(record, source);
    if (stripTags) {
        return <div style={elStyle}>{removeTags(value)}</div>;
    }

    return <div style={elStyle} dangerouslySetInnerHTML={{ __html: value }}></div>;
};

RichTextField.defaultProps = {
    stripTags: false,
};

RichTextField.propTypes = {
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    stripTags: PropTypes.bool,
};

export default RichTextField;

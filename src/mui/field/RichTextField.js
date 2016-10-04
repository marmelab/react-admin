import React, { PropTypes } from 'react';
import get from 'lodash.get';

export const removeTags = input => input.replace(/<[^>]+>/gm, '');

const RichTextField = ({ source, record = {}, stripTags }) => {
    const value = get(record, source);
    if (stripTags) {
        return <div>{removeTags(value)}</div>;
    }

    return <div dangerouslySetInnerHTML={{ __html: value }}></div>;
};

RichTextField.defaultProps = {
    stripTags: false,
};

RichTextField.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    stripTags: PropTypes.bool,
};

export default RichTextField;

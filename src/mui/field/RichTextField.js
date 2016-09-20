import React, { PropTypes } from 'react';

export const stripTags = input => input.replace(/<[^>]+>/gm, '');

const RichTextField = ({ source, record = {}, stripped }) => {
    const value = record[source];
    if (stripped) {
        return <div>{stripTags(value)}</div>;
    }

    return <div dangerouslySetInnerHTML={{ __html: value }}></div>;
};

RichTextField.defaultProps = {
    stripped: false,
};

RichTextField.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    stripped: PropTypes.bool,
};

export default RichTextField;

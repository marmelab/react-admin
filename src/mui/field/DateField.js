import React, { PropTypes } from 'react';
import get from 'lodash.get';

const DateField = ({ source, record, showTime = false, elStyle }) => {
    if (!record) return null;
    const value = get(record, source);
    if (value == null) return null;
    const date = value instanceof Date ? value : new Date(value);
    return <span style={elStyle} >{showTime ? date.toLocaleString() : date.toLocaleDateString()}</span>;
};

DateField.propTypes = {
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    showTime: PropTypes.bool,
    source: PropTypes.string.isRequired,
};

export default DateField;

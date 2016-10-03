import React, { PropTypes } from 'react';
import get from 'lodash.get';

const DateField = ({ source, record, showTime = false }) => {
    const value = get(record, source);
    const date = value instanceof Date ? value : new Date(value);
    return <span>{showTime ? date.toLocaleString() : date.toLocaleDateString()}</span>;
};

DateField.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    showTime: PropTypes.bool,
};

export default DateField;

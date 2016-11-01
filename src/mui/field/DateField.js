import React, { PropTypes } from 'react';
import get from 'lodash.get';

const DateField = ({ source, record, showTime = false, style }) => {
    const value = get(record, source);
    const date = value instanceof Date ? value : new Date(value);
    return <span style={style} >{showTime ? date.toLocaleString() : date.toLocaleDateString()}</span>;
};

DateField.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    showTime: PropTypes.bool,
    source: PropTypes.string.isRequired,
    style: PropTypes.object,
};

export default DateField;

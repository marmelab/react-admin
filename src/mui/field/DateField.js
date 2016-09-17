import React, { PropTypes } from 'react';

const DateField = ({ source, record, showTime = false }) => {
    const date = record[source] instanceof Date ? record[source] : new Date(record[source]);
    return <span>{showTime ? date.toLocaleString() : date.toLocaleDateString()}</span>;
};

DateField.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    showTime: PropTypes.bool,
};

export default DateField;

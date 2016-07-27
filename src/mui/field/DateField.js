import React, { PropTypes } from 'react';

const TextField = ({ source, record = {} }) => <span>{record[source] instanceof Date ? record[source].toLocaleDateString() : (new Date(record[source])).toLocaleDateString()}</span>;

TextField.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
};

export default TextField;

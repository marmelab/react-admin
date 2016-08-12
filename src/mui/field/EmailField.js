import React, { PropTypes } from 'react';

const EmailField = ({ source, record = {} }) => <a href={`mailto:${record[source]}`}>{record[source]}</a>;

EmailField.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
};

export default EmailField;

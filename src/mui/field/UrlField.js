import React, { PropTypes } from 'react';

const UrlField = ({ source, record = {} }) => <a href={record[source]}>{record[source]}</a>;

UrlField.propTypes = {
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

export default UrlField;

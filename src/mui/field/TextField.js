import React, { PropTypes } from 'react';

const TextField = ({ source, record = {} }) => <span>{record[source]}</span>;

TextField.propTypes = {
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

export default TextField;

import React, { PropTypes } from 'react';

const Column = ({ source, record = {} }) => (
    <span>{record[source]}</span>
);

Column.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
};

export default Column;

import React, { PropTypes } from 'react';

/**
 * @example
 * <FunctionField source="last_name" label="Name" render={record => `${record.first_name} ${record.last_name}`} />
 */
const FunctionField = ({ record = {}, source, render, style }) => record ?
    <span style={style}>{render(record)}</span> :
    null;

FunctionField.propTypes = {
    render: PropTypes.func.isRequired,
    record: PropTypes.object,
    source: PropTypes.string,
    style: PropTypes.object,
};

export default FunctionField;

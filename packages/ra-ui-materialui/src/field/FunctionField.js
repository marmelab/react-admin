import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import sanitizeRestProps from './sanitizeRestProps';

/**
 * @example
 * <FunctionField source="last_name" label="Name" render={record => `${record.first_name} ${record.last_name}`} />
 */
const FunctionField = ({ className, record = {}, source, render, ...rest }) =>
    record ? (
        <span className={className} {...sanitizeRestProps(rest)}>
            {render(record, source)}
        </span>
    ) : null;

FunctionField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    label: PropTypes.string,
    render: PropTypes.func.isRequired,
    record: PropTypes.object,
    sortBy: PropTypes.string,
    source: PropTypes.string,
};

const PureFunctionField = pure(FunctionField);

PureFunctionField.defaultProps = {
    addLabel: true,
};

export default PureFunctionField;

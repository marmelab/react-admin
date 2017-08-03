import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import pure from 'recompose/pure';

import withDatagridHeader from '../list/withDatagridHeader';

/**
 * @example
 * <FunctionField source="last_name" label="Name" render={record => `${record.first_name} ${record.last_name}`} />
 */
const FunctionField = ({ record = {}, source, render, elStyle }) =>
    record
        ? <span style={elStyle}>
              {render(record, source)}
          </span>
        : null;

FunctionField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    render: PropTypes.func.isRequired,
    record: PropTypes.object,
    source: PropTypes.string,
};

const PureFunctionField = compose(pure, withDatagridHeader)(FunctionField);

PureFunctionField.defaultProps = {
    addLabel: true,
};

export default PureFunctionField;

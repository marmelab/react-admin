import React, { PropTypes } from 'react';
import get from 'lodash.get';

/**
 * @example
 * <NumberField source="total" decimals={2} />
 */
const NumberField = ({ record, source, decimals, elStyle }) => record ?
    <span style={elStyle}>{get(record, source).toFixed(decimals)}</span> :
    null;

NumberField.propTypes = {
    decimals: PropTypes.number,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

NumberField.defaultProps = {
    style: { textAlign: 'right' },
    decimals: 0,
    headerStyle: { textAlign: 'right' },
};

export default NumberField;

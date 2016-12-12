import React, { PropTypes } from 'react';
import get from 'lodash.get';

/**
 * @example
 * <NumberField source="total" decimals={2} />
 */
const NumberField = ({ record, source, decimals, prefix, suffix, elStyle }) => record ?
    <span style={elStyle}>{prefix}{get(record, source).toFixed(decimals)}{suffix}</span> :
    null;

NumberField.propTypes = {
    decimals: PropTypes.number,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    prefix: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    suffix: PropTypes.string,
};

NumberField.defaultProps = {
    style: { textAlign: 'right' },
    decimals: 0,
    headerStyle: { textAlign: 'right' },
};

export default NumberField;

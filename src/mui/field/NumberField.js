import React, { PropTypes } from 'react';
import get from 'lodash.get';

/**
 * @example
 * <NumberField source="total" decimals={2} />
 */
const NumberField = ({ record, source, decimals, style }) => record ?
    <span style={style}>{get(record, source).toFixed(decimals)}</span> :
    null;

NumberField.propTypes = {
    decimals: PropTypes.number,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    style: PropTypes.object,
};

NumberField.defaultProps = {
    cellStyle: { td: { textAlign: 'right' } },
    decimals: 0,
    headerStyle: { th: { textAlign: 'right' } },
};

export default NumberField;

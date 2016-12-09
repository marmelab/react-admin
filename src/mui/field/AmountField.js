import React, { PropTypes } from 'react';
import get from 'lodash.get';

/**
 * @example
 * <AmountField source="total" currency="€" decimals={2} />
 */
const AmountField = ({ record, source, currency, decimals, style }) => record ?
    <span style={style}>{currency}{get(record, source).toFixed(decimals)}</span> :
    null;

AmountField.propTypes = {
    currency: PropTypes.string,
    decimals: PropTypes.number,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    style: PropTypes.object,
};

AmountField.defaultProps = {
    cellStyle: { td: { textAlign: 'right' } },
    decimals: 2,
    currency: '$',
    headerStyle: { th: { textAlign: 'right' } },
};

export default AmountField;

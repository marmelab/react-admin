import React, { PropTypes } from 'react';
import get from 'lodash.get';

/**
 * @example
 * <AmountField source="total" currency="€" decimals={2} />
 */
const AmountField = ({ record, source, currency, decimals, elStyle }) => record ?
    <span style={elStyle}>{currency}{get(record, source).toFixed(decimals)}</span> :
    null;

AmountField.propTypes = {
    currency: PropTypes.string,
    decimals: PropTypes.number,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

AmountField.defaultProps = {
    style: { textAlign: 'right' },
    decimals: 2,
    currency: '$',
    headerStyle: { textAlign: 'right' },
};

export default AmountField;

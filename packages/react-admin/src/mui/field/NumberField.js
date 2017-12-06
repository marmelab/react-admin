import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

const hasNumberFormat = !!(
    typeof Intl === 'object' &&
    Intl &&
    typeof Intl.NumberFormat === 'function'
);

const styles = {
    input: { textAlign: 'right' },
};

/**
 * Display a numeric value as a locale string.
 *
 * Uses Intl.NumberFormat() if available, passing the locales and options props as arguments.
 * If Intl is not available, it outputs number as is (and ignores the locales and options props).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
 * @example
 * <NumberField source="score" />
 * // renders the record { id: 1234, score: 567 } as
 * <span>567</span>
 *
 * <NumberField source="score" elStyle={{ color: 'red' }} />
 * // renders the record { id: 1234, score: 567 } as
 * <span style="color:red;">567</span>
 *
 * <NumberField source="share" options={{ style: 'percent' }} />
 * // renders the record { id: 1234, share: 0.2545 } as
 * <span>25%</span>
 *
 * <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
 * // renders the record { id: 1234, price: 25.99 } as
 * <span>$25.99</span>
 *
 * <NumberField source="price" locales="fr-FR" options={{ style: 'currency', currency: 'USD' }} />
 * // renders the record { id: 1234, price: 25.99 } as
 * <span>25,99 $US</span>
 */
export const NumberField = ({
    classes,
    className,
    record,
    source,
    locales,
    options,
    elStyle,
}) => {
    if (!record) return null;
    const value = get(record, source);
    if (value == null) return null;
    if (!hasNumberFormat)
        return (
            <span
                className={classnames(classes.input, className)}
                style={elStyle}
            >
                {value}
            </span>
        );
    return (
        <span className={classnames(classes.input, className)} style={elStyle}>
            {value.toLocaleString(locales, options)}
        </span>
    );
};

NumberField.propTypes = {
    addLabel: PropTypes.bool,
    classes: PropTypes.object,
    className: PropTypes.string,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    options: PropTypes.object,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PureNumberField = pure(NumberField);

PureNumberField.defaultProps = {
    addLabel: true,
};

export default withStyles(styles)(PureNumberField);

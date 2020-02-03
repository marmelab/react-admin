import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import pure from 'recompose/pure';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const hasNumberFormat = !!(
    typeof Intl === 'object' &&
    Intl &&
    typeof Intl.NumberFormat === 'function'
);

interface Props extends FieldProps {
    locales?: string | string[];
    options?: object;
}

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
 * <NumberField source="score" className="red" />
 * // renders the record { id: 1234, score: 567 } as
 * <span class="red">567</span>
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
export const NumberField: FunctionComponent<
    Props & InjectedFieldProps & TypographyProps
> = ({ className, record, source, locales, options, textAlign, ...rest }) => {
    if (!record) {
        return null;
    }
    const value = get(record, source);
    if (value == null) {
        return null;
    }

    return (
        <Typography
            variant="body2"
            component="span"
            className={className}
            {...sanitizeRestProps(rest)}
        >
            {hasNumberFormat ? value.toLocaleString(locales, options) : value}
        </Typography>
    );
};

// wat? TypeScript looses the displayName if we don't set it explicitly
NumberField.displayName = 'NumberField';

const EnhancedNumberField = pure<Props & TypographyProps>(NumberField);

EnhancedNumberField.defaultProps = {
    addLabel: true,
    textAlign: 'right',
};

EnhancedNumberField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    options: PropTypes.object,
};

EnhancedNumberField.displayName = 'EnhancedNumberField';

export default EnhancedNumberField;

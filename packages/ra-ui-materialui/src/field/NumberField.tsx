import * as React from 'react';
import { memo, FC } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import { useRecordContext } from 'ra-core';

import sanitizeFieldRestProps from './sanitizeFieldRestProps';
import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const hasNumberFormat = !!(
    typeof Intl === 'object' &&
    Intl &&
    typeof Intl.NumberFormat === 'function'
);

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
export const NumberField: FC<NumberFieldProps> = memo(props => {
    const {
        className,
        emptyText,
        source,
        locales,
        options,
        textAlign,
        ...rest
    } = props;
    const record = useRecordContext(props);
    if (!record) {
        return null;
    }
    const value = get(record, source);
    if (value == null) {
        return emptyText ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                {emptyText}
            </Typography>
        ) : null;
    }

    return (
        <Typography
            variant="body2"
            component="span"
            className={className}
            {...sanitizeFieldRestProps(rest)}
        >
            {hasNumberFormat ? value.toLocaleString(locales, options) : value}
        </Typography>
    );
});

// what? TypeScript loses the displayName if we don't set it explicitly
NumberField.displayName = 'NumberField';

NumberField.defaultProps = {
    addLabel: true,
    textAlign: 'right',
};
NumberField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    options: PropTypes.object,
};

export interface NumberFieldProps
    extends PublicFieldProps,
        InjectedFieldProps,
        TypographyProps {
    locales?: string | string[];
    options?: object;
}

export default NumberField;

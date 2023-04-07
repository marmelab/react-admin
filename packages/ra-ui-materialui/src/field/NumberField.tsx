import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { Call, Objects } from 'hotscript';
import { useRecordContext, useTranslate } from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';
import { genericMemo } from './genericMemo';

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
const NumberFieldImpl = <
    RecordType extends Record<string, unknown> = Record<string, unknown>
>(
    props: NumberFieldProps<RecordType>
) => {
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
    const translate = useTranslate();

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
                {emptyText && translate(emptyText, { _: emptyText })}
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
            {hasNumberFormat && typeof value === 'number'
                ? value.toLocaleString(locales, options)
                : value}
        </Typography>
    );
};

export const NumberField = genericMemo(NumberFieldImpl);

// what? TypeScript loses the displayName if we don't set it explicitly
// @ts-ignore
NumberField.displayName = 'NumberField';

// @ts-ignore
NumberField.defaultProps = {
    textAlign: 'right',
};

// @ts-ignore
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

export interface NumberFieldProps<
    RecordType extends Record<string, unknown> = Record<string, unknown>
> extends PublicFieldProps,
        InjectedFieldProps<RecordType>,
        Omit<TypographyProps, 'textAlign'> {
    locales?: string | string[];
    options?: object;
    source?: unknown extends RecordType
        ? string
        : Call<Objects.AllPaths, RecordType>;
    sortBy?: unknown extends RecordType
        ? string
        : Call<Objects.AllPaths, RecordType>;
}

const hasNumberFormat = !!(
    typeof Intl === 'object' &&
    Intl &&
    typeof Intl.NumberFormat === 'function'
);

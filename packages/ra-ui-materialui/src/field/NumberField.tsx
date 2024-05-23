import * as React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { useFieldValue, useTranslate } from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { FieldProps } from './types';
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
    RecordType extends Record<string, any> = Record<string, any>,
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
        transform = defaultTransform,
        ...rest
    } = props;
    const translate = useTranslate();
    let value = useFieldValue(props);

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

    if (transform) {
        value = transform(value);
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

const defaultTransform = value =>
    value && typeof value === 'string' && !isNaN(value as any) ? +value : value;

// what? TypeScript loses the displayName if we don't set it explicitly
NumberFieldImpl.displayName = 'NumberFieldImpl';

export const NumberField = genericMemo(NumberFieldImpl);
// @ts-expect-error This is a hack that replaces react support for defaultProps. We currently need this for the Datagrid.
NumberField.textAlign = 'right';

export interface NumberFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends FieldProps<RecordType>,
        Omit<TypographyProps, 'textAlign'> {
    locales?: string | string[];
    options?: object;
    transform?: (value: any) => number;
}

const hasNumberFormat = !!(
    typeof Intl === 'object' &&
    Intl &&
    typeof Intl.NumberFormat === 'function'
);

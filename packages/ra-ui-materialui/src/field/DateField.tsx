import * as React from 'react';
import { memo, FC } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Typography, TypographyProps } from '@mui/material';
import { useRecordContext } from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';

/**
 * Display a date value as a locale string.
 *
 * Uses Intl.DateTimeFormat() if available, passing the locales and options props as arguments.
 * If Intl is not available, it outputs date as is (and ignores the locales and options props).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
 * @example
 * <DateField source="published_at" />
 * // renders the record { id: 1234, published_at: new Date('2012-11-07') } as
 * <span>07/11/2012</span>
 *
 * <DateField source="published_at" className="red" />
 * // renders the record { id: 1234, new Date('2012-11-07') } as
 * <span class="red">07/11/2012</span>
 *
 * <DateField source="share" options={{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }} />
 * // renders the record { id: 1234, new Date('2012-11-07') } as
 * <span>Wednesday, November 7, 2012</span>
 *
 * <DateField source="price" locales="fr-FR" options={{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }} />
 * // renders the record { id: 1234, new Date('2012-11-07') } as
 * <span>mercredi 7 novembre 2012</span>
 */
export const DateField: FC<DateFieldProps> = memo(props => {
    const {
        className,
        emptyText,
        locales,
        options,
        showTime = false,
        source,
        ...rest
    } = props;
    const record = useRecordContext(props);
    if (!record) {
        return null;
    }
    const value = get(record, source);
    if (value == null || value === '') {
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

    const date = value instanceof Date ? value : new Date(value);
    let dateOptions = options;
    if (
        typeof value === 'string' &&
        value.length <= 10 &&
        !showTime &&
        !options
    ) {
        // Input is a date string (e.g. '2022-02-15') without time and time zone.
        // Force timezone to UTC to fix issue with people in negative time zones
        // who may see a different date when calling toLocaleDateString().
        dateOptions = { timeZone: 'UTC' };
    }
    const dateString = showTime
        ? toLocaleStringSupportsLocales
            ? date.toLocaleString(locales, options)
            : date.toLocaleString()
        : toLocaleStringSupportsLocales
        ? date.toLocaleDateString(locales, dateOptions)
        : date.toLocaleDateString();

    return (
        <Typography
            component="span"
            variant="body2"
            className={className}
            {...sanitizeFieldRestProps(rest)}
        >
            {dateString}
        </Typography>
    );
});

DateField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    options: PropTypes.object,
    showTime: PropTypes.bool,
};

DateField.displayName = 'DateField';

export interface DateFieldProps
    extends PublicFieldProps,
        InjectedFieldProps,
        Omit<TypographyProps, 'textAlign'> {
    locales?: string | string[];
    options?: object;
    showTime?: boolean;
}

const toLocaleStringSupportsLocales = (() => {
    // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
    try {
        new Date().toLocaleString('i');
    } catch (error) {
        return error instanceof RangeError;
    }
    return false;
})();

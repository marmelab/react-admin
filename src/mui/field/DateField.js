import React, { PropTypes } from 'react';
import get from 'lodash.get';

const toLocaleStringSupportsLocales = (() => {
    // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
    try {
        new Date().toLocaleString("i");
    } catch (error) {
        return (error instanceof RangeError);
    }
    return false;
})();

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
 * <DateField source="published_at" elStyle={{ color: 'red' }} />
 * // renders the record { id: 1234, new Date('2012-11-07') } as
 * <span style="color:red;">07/11/2012</span>
 *
 * <DateField source="share" options={{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }} />
 * // renders the record { id: 1234, new Date('2012-11-07') } as
 * <span>Wednesday, November 7, 2012</span>
 *
 * <DateField source="price" locales="fr-FR" options={{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }} />
 * // renders the record { id: 1234, new Date('2012-11-07') } as
 * <span>mercredi 7 novembre 2012</span>
 */

const DateField = ({ elStyle, locales, options, record, showTime = false, source }) => {
    if (!record) return null;
    const value = get(record, source);
    if (value == null) return null;
    const date = value instanceof Date ? value : new Date(value);
    const dateString = showTime ?
        (toLocaleStringSupportsLocales ? date.toLocaleString(locales, options) : date.toLocaleString()) :
        (toLocaleStringSupportsLocales ? date.toLocaleDateString(locales, options) : date.toLocaleDateString());

    return <span style={elStyle}>{dateString}</span>;
};

DateField.propTypes = {
    elStyle: PropTypes.object,
    label: PropTypes.string,
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    options: PropTypes.object,
    record: PropTypes.object,
    showTime: PropTypes.bool,
    source: PropTypes.string.isRequired,
};

export default DateField;

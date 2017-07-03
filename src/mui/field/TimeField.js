import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

export const datify = value => {

  if (!value) {
    return null;
  }

  /* If input does not start with YYYY-MM-DD,
     prepend the current date and parse as date
     using the local timezone. */
  const date = (value instanceof Date) ?
    value :
    (!value.match(/^\d{4}-\d{2}-\d{2}/)) ?
      new Date(new Date().toISOString().substring(0, 10) + 'T' + value) :
      new Date(value)

    if (isNaN(date)) {
      throw new Error(`Invalid date: ${value}`);
    }

    return date;

}

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
 * <TimeField source="published_at" />
 * // renders the record { id: 1234, published_at: new Date('2012-11-07') } as
 * <span>07/11/2012</span>
 *
 * <TimeField source="published_at" elStyle={{ color: 'red' }} />
 * // renders the record { id: 1234, new Date('2012-11-07') } as
 * <span style="color:red;">07/11/2012</span>
 *
 * <TimeField source="share" options={{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }} />
 * // renders the record { id: 1234, new Date('2012-11-07') } as
 * <span>Wednesday, November 7, 2012</span>
 *
 * <TimeField source="price" locales="fr-FR" options={{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }} />
 * // renders the record { id: 1234, new Date('2012-11-07') } as
 * <span>mercredi 7 novembre 2012</span>
 */

export const TimeField = ({ elStyle, locales, options, record, source }) => {
    if (!record) return null;
    const value = get(record, source);
    if (value == null) return null;
    const date = datify(value);
    const dateString = (toLocaleStringSupportsLocales ? date.toLocaleTimeString(locales, options) : date.toLocaleTimeString())

    return <span style={elStyle}>{dateString}</span>;
};

TimeField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    options: PropTypes.object,
    record: PropTypes.object,
    showTime: PropTypes.bool,
    source: PropTypes.string.isRequired,
};

const PureTimeField = pure(TimeField);

PureTimeField.defaultProps = {
    addLabel: true,
};

export default PureTimeField;

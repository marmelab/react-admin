import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

import { parse, format } from 'libphonenumber-js';

export const localPhoneFormat = (parsed_number, locale) => {
    if (!locale) {
        // plain text (with no space) formatting for href tel:
        parsed_number = format(parsed_number, 'International_plaintext');
    } else if (parsed_number.country === locale) {
        parsed_number = format(parsed_number, 'National');
    } else {
        parsed_number = format(parsed_number, 'International');
    }
    return parsed_number;
};

const PhoneField = ({ source, record, elStyle, locale }) => {
    if (!record) {
        return null;
    }

    const parsed_number = parse(get(record, source), {
        country: { default: locale },
    });

    if (!parsed_number || !Object.keys(parsed_number).length) {
        return null;
    }

    return (
        <a style={elStyle} href={`tel:${localPhoneFormat(parsed_number)}`}>
            {localPhoneFormat(parsed_number, locale)}
        </a>
    );
};

export const phoneFormatToString = (num, locale = 'FR') => {
    if (!num) {
        return null;
    }

    const parsed_number = parse(num, { country: { default: locale } });

    if (!parsed_number || !Object.keys(parsed_number).length) {
        return null;
    }

    const phone_num = localPhoneFormat(parsed_number, locale);
    return phone_num;
};

PhoneField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    locale: PropTypes.string,
    num: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PurePhoneField = pure(PhoneField);

PurePhoneField.defaultProps = {
    addLabel: true,
    locale: 'FR',
};

export default PurePhoneField;

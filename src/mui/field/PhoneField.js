import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

import { parse, format } from 'libphonenumber-js';

export const localPhoneFormat = (input, locale) => {
  if (!locale) {
    // plain text (with no space) formatting for href tel:
    input = format(input, 'International_plaintext');
  }
  else if (input.country === locale) {
    input =  format(input, 'National');
  } else {
    input = format(input, 'International');
  }
  return input;
};

const PhoneField = ({ source, record, elStyle, locale }) => {
  if (!record) {
    return null;
  }

  const parsed_number = parse(get(record, source), {country: {default: locale}});
  console.log(parsed_number);
  if (!parsed_number || !Object.keys(parsed_number).length) {
    return null;
  }

  return (
    <a style={elStyle} href={`tel:${localPhoneFormat(parsed_number)}`}>
      {localPhoneFormat(parsed_number, locale)}
    </a>
  );
};

PhoneField.propTypes = {
  addLabel: PropTypes.bool,
  elStyle: PropTypes.object,
  label: PropTypes.string,
  locale: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};

const PurePhoneField = pure(PhoneField);

PurePhoneField.defaultProps = {
  addLabel: true,
  locale: 'FR',
};

export default PurePhoneField;

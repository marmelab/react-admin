import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

const EmailField = ({ source, record = {}, elStyle }) =>
    <a style={elStyle} href={`mailto:${get(record, source)}`}>{get(record, source)}</a>;

EmailField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PureEmailField = pure(EmailField);

PureEmailField.defaultProps = {
    addLabel: true,
};

export default PureEmailField;

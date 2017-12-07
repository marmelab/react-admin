import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

const EmailField = ({ className, source, record = {} }) => (
    <a className={className} href={`mailto:${get(record, source)}`}>
        {get(record, source)}
    </a>
);

EmailField.propTypes = {
    addLabel: PropTypes.bool,
    className: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PureEmailField = pure(EmailField);

PureEmailField.defaultProps = {
    addLabel: true,
};

export default PureEmailField;

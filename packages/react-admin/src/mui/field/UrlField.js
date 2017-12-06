import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

const UrlField = ({ className, source, record = {}, elStyle }) => (
    <a className={className} href={get(record, source)} style={elStyle}>
        {get(record, source)}
    </a>
);

UrlField.propTypes = {
    addLabel: PropTypes.bool,
    className: PropTypes.string,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PureUrlField = pure(UrlField);

PureUrlField.defaultProps = {
    addLabel: true,
};

export default PureUrlField;

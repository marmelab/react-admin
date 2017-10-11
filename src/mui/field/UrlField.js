import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

const UrlField = ({ source, record = {}, elStyle }) => (
    <a href={get(record, source)} style={elStyle}>
        {get(record, source)}
    </a>
);

UrlField.propTypes = {
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

export default pure(UrlField);

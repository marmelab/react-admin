import React, { PropTypes } from 'react';
import get from 'lodash.get';

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

export default UrlField;

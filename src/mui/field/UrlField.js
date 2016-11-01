import React, { PropTypes } from 'react';
import get from 'lodash.get';

const UrlField = ({ source, record = {}, style }) => (
    <a href={get(record, source)} style={style}>
        {get(record, source)}
    </a>
);

UrlField.propTypes = {
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    style: PropTypes.object,
};

export default UrlField;

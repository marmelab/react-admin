import React, { PropTypes } from 'react';
import get from 'lodash.get';

const UrlField = ({ source, record = {} }) => <a href={get(record, source)}>{get(record, source)}</a>;

UrlField.propTypes = {
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

export default UrlField;

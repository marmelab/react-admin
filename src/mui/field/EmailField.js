import React, { PropTypes } from 'react';
import get from 'lodash.get';

const EmailField = ({ source, record = {} }) => <a href={`mailto:${get(record, source)}`}>{get(record, source)}</a>;

EmailField.propTypes = {
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

export default EmailField;

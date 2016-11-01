import React, { PropTypes } from 'react';
import get from 'lodash.get';

const EmailField = ({ source, record = {}, style }) => <a style={style} href={`mailto:${get(record, source)}`}>{get(record, source)}</a>;

EmailField.propTypes = {
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    style: PropTypes.object,
};

export default EmailField;

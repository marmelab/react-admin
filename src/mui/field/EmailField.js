import React, { PropTypes } from 'react';
import get from 'lodash.get';

const EmailField = ({ source, record = {}, elStyle }) =>
    <a style={elStyle} href={`mailto:${get(record, source)}`}>{get(record, source)}</a>;

EmailField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

EmailField.defaultProps = {
    addLabel: true,
};

export default EmailField;

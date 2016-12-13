import React, { PropTypes } from 'react';
import get from 'lodash.get';

const TextField = ({ source, record = {}, elStyle }) =>
    <span style={elStyle}>{get(record, source)}</span>;

TextField.propTypes = {
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

export default TextField;

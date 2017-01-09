import React, { PropTypes } from 'react';
import get from 'lodash.get';

const TextField = ({ source, record = {}, elStyle }) =>
    <span style={elStyle}>{get(record, source)}</span>;

TextField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

TextField.defaultProps = {
    addLabel: true,
};

export default TextField;

import React, { PropTypes } from 'react';
import get from 'lodash.get';

const TextField = ({ source, record = {}, style }) => <span style={style}>{get(record, source)}</span>;

TextField.propTypes = {
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    style: PropTypes.object,
};

export default TextField;

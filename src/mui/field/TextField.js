import React, { PropTypes } from 'react';
import get from 'lodash.get';

const TextField = ({ source, record = {} }) => <span>{get(record, source)}</span>;

TextField.propTypes = {
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

export default TextField;

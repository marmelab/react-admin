import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

const TextField = ({ source, record = {}, elStyle }) => {
    return <span style={elStyle}>{get(record, source)}</span>;
};

TextField.propTypes = {
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

export default pure(TextField);

import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

const TextField = ({ source, record = {}, elStyle, format }) => {
    return <span style={elStyle}>{format(get(record, source))}</span>;
}

TextField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    format: PropTypes.func,
};

const PureTextField = pure(TextField);

PureTextField.defaultProps = {
    addLabel: true,
    format: v => v,
};

export default PureTextField;

import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

const TextField = ({ className, source, record = {} }) => {
    return <span className={className}>{get(record, source)}</span>;
};

TextField.propTypes = {
    addLabel: PropTypes.bool,
    className: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PureTextField = pure(TextField);

PureTextField.defaultProps = {
    addLabel: true,
};

export default PureTextField;

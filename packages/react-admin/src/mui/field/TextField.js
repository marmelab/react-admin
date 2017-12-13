import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

const TextField = ({
    addLabel,
    basePath,
    className,
    cellClassName,
    headerClassName,
    source,
    record = {},
    ...rest
}) => {
    return (
        <span className={className} {...rest}>
            {get(record, source)}
        </span>
    );
};

TextField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PureTextField = pure(TextField);

PureTextField.defaultProps = {
    addLabel: true,
};

export default PureTextField;

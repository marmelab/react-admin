import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

const EmailField = ({
    addLabel,
    basePath,
    className,
    cellClassName,
    headerClassName,
    source,
    record = {},
    ...rest
}) => (
    <a className={className} href={`mailto:${get(record, source)}`} {...rest}>
        {get(record, source)}
    </a>
);

EmailField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PureEmailField = pure(EmailField);

PureEmailField.defaultProps = {
    addLabel: true,
};

export default PureEmailField;

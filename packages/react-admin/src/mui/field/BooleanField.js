import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

import FalseIcon from 'material-ui-icons/Clear';
import TrueIcon from 'material-ui-icons/Done';

export const BooleanField = ({
    addLabel,
    basePath,
    className,
    cellClassName,
    headerClassName,
    source,
    record = {},
    ...rest
}) => {
    if (get(record, source) === false) {
        return <FalseIcon className={className} {...rest} />;
    }

    if (get(record, source) === true) {
        return <TrueIcon className={className} {...rest} />;
    }

    return <span className={className} {...rest} />;
};

BooleanField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PureBooleanField = pure(BooleanField);

PureBooleanField.defaultProps = {
    addLabel: true,
};

export default PureBooleanField;

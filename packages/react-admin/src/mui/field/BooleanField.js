import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

import FalseIcon from 'material-ui-icons/Clear';
import TrueIcon from 'material-ui-icons/Done';

export const BooleanField = ({ className, source, record = {}, elStyle }) => {
    if (get(record, source) === false) {
        return <FalseIcon className={className} style={elStyle} />;
    }

    if (get(record, source) === true) {
        return <TrueIcon className={className} style={elStyle} />;
    }

    return <span className={className} style={elStyle} />;
};

BooleanField.propTypes = {
    addLabel: PropTypes.bool,
    className: PropTypes.string,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PureBooleanField = pure(BooleanField);

PureBooleanField.defaultProps = {
    addLabel: true,
    elStyle: {
        display: 'block',
        margin: 'auto',
    },
};

export default PureBooleanField;

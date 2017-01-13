import React, { PropTypes } from 'react';
import get from 'lodash.get';

import FalseIcon from 'material-ui/svg-icons/content/clear';
import TrueIcon from 'material-ui/svg-icons/action/done';

const BooleanField = ({ source, record = {}, elStyle }) => {
    if (get(record, source) === false) {
        return <FalseIcon style={elStyle} />;
    }

    if (get(record, source) === true) {
        return <TrueIcon style={elStyle} />;
    }

    return <span style={elStyle} />;
};

BooleanField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

BooleanField.defaultProps = {
    addLabel: true,
    elStyle: {
        display: 'block',
        margin: 'auto',
    },
};

export default BooleanField;

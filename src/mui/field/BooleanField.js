import React, { PropTypes } from 'react';
import get from 'lodash.get';

import FalseIcon from 'material-ui/svg-icons/content/clear';
import TrueIcon from 'material-ui/svg-icons/action/done';

const BooleanField = ({ source, record = {}, style }) => {
    if (get(record, source) === false) {
        return <FalseIcon style={style} />;
    }

    if (get(record, source) === true) {
        return <TrueIcon style={style} />;
    }

    return <span style={style} />;
};

BooleanField.propTypes = {
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

BooleanField.defaultProps = {
    style: {
        display: 'block',
        margin: 'auto',
    },
};

export default BooleanField;

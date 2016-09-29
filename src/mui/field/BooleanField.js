import React, { PropTypes } from 'react';

import FalseIcon from 'material-ui/svg-icons/content/clear';
import TrueIcon from 'material-ui/svg-icons/action/done';

const BooleanField = ({ source, record = {} }) => {
    if (record[source] === false) {
        return <FalseIcon />;
    }

    if (record[source] === true) {
        return <TrueIcon />;
    }

    return <span />;
};

BooleanField.propTypes = {
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

export default BooleanField;

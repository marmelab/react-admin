import React, { PropTypes } from 'react';

import FalseIcon from 'material-ui/svg-icons/content/clear';
import TrueIcon from 'material-ui/svg-icons/action/done';

const style = {
    display: 'block',
    margin: 'auto',
};

const BooleanField = ({ source, record = {} }) => {
    if (record[source] === false) {
        return <FalseIcon style={style} />;
    }

    if (record[source] === true) {
        return <TrueIcon style={style} />;
    }

    return <span style={style} />;
};

BooleanField.propTypes = {
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

export default BooleanField;

import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import compose from 'recompose/compose';
import pure from 'recompose/pure';

import withDatagridHeader from '../list/withDatagridHeader';
import FalseIcon from 'material-ui/svg-icons/content/clear';
import TrueIcon from 'material-ui/svg-icons/action/done';

export const BooleanField = ({ source, record = {}, elStyle }) => {
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

const PureBooleanField = compose(pure, withDatagridHeader)(BooleanField);

PureBooleanField.defaultProps = {
    addLabel: true,
    elStyle: {
        display: 'block',
        margin: 'auto',
    },
};

export default PureBooleanField;

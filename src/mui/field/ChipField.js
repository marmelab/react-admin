import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import Chip from 'material-ui/Chip';

import withDatagridHeader from '../list/withDatagridHeader';

const ChipField = ({ source, record = {}, elStyle = { margin: 4 } }) =>
    <Chip style={elStyle}>
        {get(record, source)}
    </Chip>;

ChipField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

const PureChipField = compose(pure, withDatagridHeader)(ChipField);

PureChipField.defaultProps = {
    addLabel: true,
};

export default PureChipField;

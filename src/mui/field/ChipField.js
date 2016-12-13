import React, { PropTypes } from 'react';
import Chip from 'material-ui/Chip';
import get from 'lodash.get';

const ChipField = ({ source, record = {}, elStyle = { margin: 4 } }) =>
    <Chip style={elStyle}>{get(record, source)}</Chip>;

ChipField.propTypes = {
    elStyle: PropTypes.object,
    label: PropTypes.string,
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

export default ChipField;

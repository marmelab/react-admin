import React, { PropTypes } from 'react';
import Chip from 'material-ui/Chip';
import get from 'lodash.get';

const ChipField = ({ source, record = {}, style = { margin: 4 } }) => <Chip style={style}>{get(record, source)}</Chip>;

ChipField.propTypes = {
    label: PropTypes.string,
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
    style: PropTypes.object,
};

export default ChipField;

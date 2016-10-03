import React, { PropTypes } from 'react';
import Chip from 'material-ui/Chip';
import get from 'lodash.get';

const ChipField = ({ source, record = {} }) => <Chip style={{ margin: 4 }}>{get(record, source)}</Chip>;

ChipField.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
};

export default ChipField;

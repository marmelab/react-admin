import React, { PropTypes } from 'react';
import Chip from 'material-ui/Chip';

const ChipField = ({ source, record = {} }) => <Chip style={{ margin: 4 }}>{record[source]}</Chip>;

ChipField.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
};

export default ChipField;

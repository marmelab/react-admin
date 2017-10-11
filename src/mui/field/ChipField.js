import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';
import Chip from 'material-ui/Chip';

const ChipField = ({ source, record = {}, elStyle = { margin: 4 } }) => (
    <Chip style={elStyle}>{get(record, source)}</Chip>
);

ChipField.propTypes = {
    elStyle: PropTypes.object,
    label: PropTypes.string,
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

export default pure(ChipField);

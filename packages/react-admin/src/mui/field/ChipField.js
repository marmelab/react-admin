import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';
import Chip from 'material-ui/Chip';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

const styles = {
    chip: { margin: 4 },
};

const ChipField = ({ className, classes, source, record = {} }) => (
    <Chip
        className={classnames(classes.chip, className)}
        label={get(record, source)}
    />
);

ChipField.propTypes = {
    addLabel: PropTypes.bool,
    className: PropTypes.string,
    classes: PropTypes.object,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

const PureChipField = withStyles(styles)(pure(ChipField));

PureChipField.defaultProps = {
    addLabel: true,
};

export default PureChipField;

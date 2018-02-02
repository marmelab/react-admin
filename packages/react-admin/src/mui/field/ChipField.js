import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';
import Chip from 'material-ui/Chip';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import sanitizeRestProps from './sanitizeRestProps';
import omit from 'lodash.omit';

const styles = {
    chip: { margin: 4 },
};

export const ChipField = ({
    className,
    classes,
    source,
    record = {},
    ...rest
}) => {
    return (
        <Chip
            className={classnames(classes.chip, className)}
            label={get(record, source)}
            {...sanitizeRestProps(omit(rest, ['label']))}
        />
    );
};

ChipField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    classes: PropTypes.object,
    elStyle: PropTypes.object,
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

const PureChipField = withStyles(styles)(pure(ChipField));

export default PureChipField;

import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import pure from 'recompose/pure';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import sanitizeRestProps from './sanitizeRestProps';

const styles = {
    chip: { margin: 4 },
};

export const ChipField = ({
    className,
    classes = {},
    source,
    record = {},
    ...rest
}) => {
    return (
        <Chip
            className={classnames(classes.chip, className)}
            label={get(record, source)}
            {...sanitizeRestProps(rest)}
        />
    );
};

ChipField.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    elStyle: PropTypes.object,
    sortBy: PropTypes.string,
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

// wat? TypeScript looses the displayName if we don't set it explicitly
ChipField.displayName = 'ChipField';

const PureChipField = withStyles(styles)(pure(ChipField));

export default PureChipField;

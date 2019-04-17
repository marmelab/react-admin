import React, { SFC } from 'react';
import compose from 'recompose/compose';
import get from 'lodash/get';
import pure from 'recompose/pure';
import Chip, { ChipProps } from '@material-ui/core/Chip';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const styles = createStyles({
    chip: { margin: 4 },
});

export const ChipField: SFC<
    FieldProps & InjectedFieldProps & WithStyles<typeof styles> & ChipProps
> = ({ className, classes, source, record = {}, ...rest }) => (
    <Chip
        className={classnames(classes.chip, className)}
        label={get(record, source)}
        {...sanitizeRestProps(rest)}
    />
);

const EnhancedChipField = compose<
    FieldProps & InjectedFieldProps & WithStyles<typeof styles> & ChipProps,
    FieldProps & ChipProps
>(
    withStyles(styles),
    pure
)(ChipField);

EnhancedChipField.defaultProps = {
    addLabel: true,
};

EnhancedChipField.propTypes = {
    ...ChipField.propTypes,
    ...fieldPropTypes,
};

export default EnhancedChipField;

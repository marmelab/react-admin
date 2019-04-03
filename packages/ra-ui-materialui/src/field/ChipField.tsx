import React, { SFC } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import get from 'lodash/get';
import pure from 'recompose/pure';
import Chip from '@material-ui/core/Chip';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps } from './types';

const styles = createStyles({
    chip: { margin: 4 },
});

interface Props extends FieldProps, WithStyles<typeof styles> {
    className?: string;
}

export const ChipField: SFC<Props> = ({
    className,
    classes,
    source,
    record = {},
    ...rest
}) => (
    <Chip
        className={classnames(classes.chip, className)}
        label={get(record, source)}
        {...sanitizeRestProps(rest)}
    />
);

// wat? TypeScript looses the displayName if we don't set it explicitly
ChipField.displayName = 'ChipField';

export default compose(
    withStyles(styles),
    pure
)(ChipField);

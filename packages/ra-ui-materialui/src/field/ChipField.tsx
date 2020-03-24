import React, { FunctionComponent, memo } from 'react';
import compose from 'recompose/compose';
import get from 'lodash/get';
import Chip, { ChipProps } from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const useStyles = makeStyles(
    {
        chip: { margin: 4 },
    },
    { name: 'RaChipField' }
);

export const ChipField: FunctionComponent<
    FieldProps & InjectedFieldProps & ChipProps
> = props => {
    const {
        className,
        classes: classesOverride,
        source,
        record = {},
        emptyText,
        ...rest
    } = props;
    const classes = useStyles(props);
    const value = get(record, source);

    if (value == null && emptyText) {
        return (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeRestProps(rest)}
            >
                {emptyText}
            </Typography>
        );
    }

    return (
        <Chip
            className={classnames(classes.chip, className)}
            label={value}
            {...sanitizeRestProps(rest)}
        />
    );
};

const EnhancedChipField = memo<FieldProps & ChipProps>(ChipField);
// @ts-ignore
EnhancedChipField.defaultProps = {
    addLabel: true,
};
// @ts-ignore
EnhancedChipField.propTypes = {
    ...ChipField.propTypes,
    ...fieldPropTypes,
};

EnhancedChipField.displayName = 'EnhancedChipField';

export default EnhancedChipField;

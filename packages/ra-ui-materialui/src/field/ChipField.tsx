import * as React from 'react';
import { FunctionComponent, memo } from 'react';
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
> = memo<FieldProps & InjectedFieldProps & ChipProps>(props => {
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
});

ChipField.defaultProps = {
    addLabel: true,
};

ChipField.propTypes = {
    ...ChipField.propTypes,
    ...fieldPropTypes,
};

export default ChipField;

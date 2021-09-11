import * as React from 'react';
import { memo, FC } from 'react';
import get from 'lodash/get';
import Chip, { ChipProps } from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { useRecordContext } from 'ra-core';

import sanitizeFieldRestProps from './sanitizeFieldRestProps';
import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const useStyles = makeStyles(
    {
        chip: { margin: 4, cursor: 'inherit' },
    },
    { name: 'RaChipField' }
);

export const ChipField: FC<ChipFieldProps> = memo(props => {
    const {
        className,
        classes: classesOverride,
        source,
        emptyText,
        ...rest
    } = props;
    const record = useRecordContext(props);
    const classes = useStyles(props);
    const value = get(record, source);

    if (value == null && emptyText) {
        return (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                {emptyText}
            </Typography>
        );
    }

    return (
        <Chip
            className={classnames(classes.chip, className)}
            label={value}
            {...sanitizeFieldRestProps(rest)}
        />
    );
});

ChipField.defaultProps = {
    addLabel: true,
};

ChipField.propTypes = {
    // @ts-ignore
    ...ChipField.propTypes,
    ...fieldPropTypes,
};

ChipField.displayName = 'ChipField';

export interface ChipFieldProps
    extends PublicFieldProps,
        InjectedFieldProps,
        Omit<ChipProps, 'label'> {}

export default ChipField;

import * as React from 'react';
import { styled } from '@mui/material/styles';
import { memo, FC } from 'react';
import get from 'lodash/get';
import Chip, { ChipProps } from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { useRecordContext } from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';

export const ChipField: FC<ChipFieldProps> = memo(props => {
    const { className, source, emptyText, ...rest } = props;
    const record = useRecordContext(props);

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
        <StyledChip
            className={clsx(ChipFieldClasses.chip, className)}
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

const PREFIX = 'RaChipField';

const ChipFieldClasses = {
    chip: `${PREFIX}-chip`,
};

const StyledChip = styled(Chip, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`&.${ChipFieldClasses.chip}`]: { margin: 4, cursor: 'inherit' },
});

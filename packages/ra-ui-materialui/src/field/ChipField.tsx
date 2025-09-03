import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import { Chip, type ChipProps, Typography } from '@mui/material';
import clsx from 'clsx';
import { useFieldValue, useTranslate } from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import type { FieldProps } from './types';
import { genericMemo } from './genericMemo';

const ChipFieldImpl = <
    RecordType extends Record<string, any> = Record<string, any>,
>(
    inProps: ChipFieldProps<RecordType>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const { className, emptyText, ...rest } = props;
    const value = useFieldValue(props);
    const translate = useTranslate();

    if (value == null || value === '') {
        if (!emptyText || emptyText.length === 0) {
            return null;
        }
        return (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                {emptyText && translate(emptyText, { _: emptyText })}
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
};
ChipFieldImpl.displayName = 'ChipFieldImpl';

export const ChipField = genericMemo(ChipFieldImpl);

export interface ChipFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends FieldProps<RecordType>,
        Omit<ChipProps, 'label' | 'children'> {
    /**
     * @internal do not use (prop required for TS to be able to cast ChipField as FunctionComponent)
     */
    children?: React.ReactNode;
}

const PREFIX = 'RaChipField';

const ChipFieldClasses = {
    chip: `${PREFIX}-chip`,
};

const StyledChip = styled(Chip, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`&.${ChipFieldClasses.chip}`]: { cursor: 'inherit' },
});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaChipField: 'root' | 'chip';
    }

    interface ComponentsPropsList {
        RaChipField: Partial<ChipFieldProps>;
    }

    interface Components {
        RaChipField?: {
            defaultProps?: ComponentsPropsList['RaChipField'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaChipField'];
        };
    }
}

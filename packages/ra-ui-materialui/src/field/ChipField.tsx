import * as React from 'react';
import { styled } from '@mui/material/styles';
import get from 'lodash/get';
import Chip, { ChipProps } from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { useRecordContext, useTranslate } from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { FieldProps, fieldPropTypes } from './types';
import { genericMemo } from './genericMemo';

const ChipFieldImpl = <
    RecordType extends Record<string, unknown> = Record<string, any>
>(
    props: ChipFieldProps<RecordType>
) => {
    const { className, source, emptyText, ...rest } = props;
    const record = useRecordContext<RecordType>(props);
    const value = get(record, source);
    const translate = useTranslate();

    if (value == null && emptyText) {
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

export const ChipField = genericMemo(ChipFieldImpl);

ChipFieldImpl.propTypes = {
    // @ts-ignore
    ...ChipField.propTypes,
    ...fieldPropTypes,
};

ChipField.propTypes = ChipFieldImpl.propTypes;

ChipFieldImpl.displayName = 'ChipFieldImpl';
ChipField.displayName = 'ChipField';

export interface ChipFieldProps<
    RecordType extends Record<string, unknown> = Record<string, any>
> extends FieldProps<RecordType>,
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

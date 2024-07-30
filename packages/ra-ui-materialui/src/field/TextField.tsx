import * as React from 'react';
import { ElementType } from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { useFieldValue, useTranslate } from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { FieldProps } from './types';
import { genericMemo } from './genericMemo';

const TextFieldImpl = <
    RecordType extends Record<string, any> = Record<string, any>,
>(
    props: TextFieldProps<RecordType>
) => {
    const { className, emptyText, ...rest } = props;
    const translate = useTranslate();
    const value = useFieldValue(props);

    return (
        <Typography
            component="span"
            variant="body2"
            className={className}
            {...sanitizeFieldRestProps(rest)}
        >
            {value != null && typeof value !== 'string'
                ? value.toString()
                : value ||
                  (emptyText ? translate(emptyText, { _: emptyText }) : null)}
        </Typography>
    );
};

// what? TypeScript loses the displayName if we don't set it explicitly
TextFieldImpl.displayName = 'TextFieldImpl';

export const TextField = genericMemo(TextFieldImpl);

export interface TextFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends FieldProps<RecordType>,
        Omit<TypographyProps, 'textAlign'> {
    // TypographyProps do not expose the component props, see https://github.com/mui/material-ui/issues/19512
    component?: ElementType<any>;
}

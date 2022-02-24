import * as React from 'react';
import { memo, FC, ElementType } from 'react';
import get from 'lodash/get';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { useRecordContext } from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';

export const TextField: FC<TextFieldProps> = memo(props => {
    const { className, source, emptyText, ...rest } = props;
    const record = useRecordContext(props);
    const value = get(record, source);

    return (
        <Typography
            component="span"
            variant="body2"
            className={className}
            {...sanitizeFieldRestProps(rest)}
        >
            {value != null && typeof value !== 'string'
                ? JSON.stringify(value)
                : value || emptyText}
        </Typography>
    );
});

// what? TypeScript loses the displayName if we don't set it explicitly
TextField.displayName = 'TextField';

TextField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
};

export interface TextFieldProps
    extends PublicFieldProps,
        InjectedFieldProps,
        Omit<TypographyProps, 'textAlign'> {
    // TypographyProps do not expose the component props, see https://github.com/mui-org/material-ui/issues/19512
    component?: ElementType<any>;
}

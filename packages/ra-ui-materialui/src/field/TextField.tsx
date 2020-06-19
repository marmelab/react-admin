import * as React from 'react';
import { FC, memo } from 'react';
import get from 'lodash/get';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const TextField: FC<TextFieldProps> = memo<TextFieldProps>(
    ({ className, source, record = {}, emptyText, ...rest }) => {
        const value = get(record, source);

        return (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeRestProps(rest)}
            >
                {value != null && typeof value !== 'string'
                    ? JSON.stringify(value)
                    : value || emptyText}
            </Typography>
        );
    }
);

// what? TypeScript looses the displayName if we don't set it explicitly
TextField.displayName = 'TextField';

TextField.defaultProps = {
    addLabel: true,
};

TextField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
};

export interface TextFieldProps
    extends FieldProps,
        InjectedFieldProps,
        TypographyProps {}

export default TextField;

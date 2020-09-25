import * as React from 'react';
import { FC, memo, ElementType } from 'react';
import get from 'lodash/get';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';
import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';

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
    extends PublicFieldProps,
        InjectedFieldProps,
        TypographyProps {
    // TypographyProps do not expose the component props, see https://github.com/mui-org/material-ui/issues/19512
    component?: ElementType<any>;
}

export default TextField;

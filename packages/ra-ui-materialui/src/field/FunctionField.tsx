import * as React from 'react';
import { FC, memo } from 'react';
import { Record } from 'ra-core';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

/**
 * Field using a render function
 *
 * @example
 * <FunctionField
 *     source="last_name" // used for sorting
 *     label="Name"
 *     render={record => record && `${record.first_name} ${record.last_name}`}
 * />
 */
const FunctionField: FC<FunctionFieldProps> = memo<FunctionFieldProps>(
    ({ className, record, source = '', render, ...rest }) =>
        record ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeRestProps(rest)}
            >
                {render(record, source)}
            </Typography>
        ) : null
);

FunctionField.defaultProps = {
    addLabel: true,
};

FunctionField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
};

export interface FunctionFieldProps
    extends FieldProps,
        InjectedFieldProps,
        TypographyProps {
    render: (record?: Record, source?: string) => any;
}

export default FunctionField;

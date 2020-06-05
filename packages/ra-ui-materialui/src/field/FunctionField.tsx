import * as React from 'react';
import { FunctionComponent, memo } from 'react';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

interface Props extends FieldProps {
    render: (record: object, source: string) => any;
}

/**
 * @example
 * <FunctionField source="last_name" label="Name" render={record => `${record.first_name} ${record.last_name}`} />
 */
const FunctionField: FunctionComponent<
    Props & InjectedFieldProps & TypographyProps
> = memo<Props & InjectedFieldProps & TypographyProps>(
    ({ className, record = {}, source, render, ...rest }) =>
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

export default FunctionField;

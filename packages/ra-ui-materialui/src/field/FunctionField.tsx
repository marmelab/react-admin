import React, { FunctionComponent } from 'react';
import pure from 'recompose/pure';
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
> = ({ className, record = {}, source, render, ...rest }) =>
    record ? (
        <Typography
            component="span"
            variant="body2"
            className={className}
            {...sanitizeRestProps(rest)}
        >
            {render(record, source)}
        </Typography>
    ) : null;

const EnhancedFunctionField = pure<Props & TypographyProps>(FunctionField);

EnhancedFunctionField.defaultProps = {
    addLabel: true,
};

EnhancedFunctionField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
};

EnhancedFunctionField.displayName = 'EnhancedFunctionField';

export default EnhancedFunctionField;

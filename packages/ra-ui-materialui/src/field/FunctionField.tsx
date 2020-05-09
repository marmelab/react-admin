import React, { FunctionComponent, memo } from 'react';
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

const EnhancedFunctionField = memo<Props & TypographyProps>(FunctionField);
// @ts-ignore
EnhancedFunctionField.defaultProps = {
    addLabel: true,
};
// @ts-ignore
EnhancedFunctionField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
};

EnhancedFunctionField.displayName = 'EnhancedFunctionField';

export default EnhancedFunctionField;

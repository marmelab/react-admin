import React, { SFC } from 'react';
import get from 'lodash/get';
import pure from 'recompose/pure';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const LongTextField: SFC<FieldProps & InjectedFieldProps & TypographyProps> = ({
    className,
    source,
    record = {},
    ...rest
}) => {
    const value = get(record, source);
    return (
        <Typography
            component="pre"
            variant="body1"
            className={className}
            {...sanitizeRestProps(rest)}
        >
            {value && typeof value !== 'string' ? JSON.stringify(value) : value}
        </Typography>
    );
};

// wat? TypeScript looses the displayName if we don't set it explicitly
LongTextField.displayName = 'LongTextField';

const EnhancedLongTextField = pure(LongTextField);

EnhancedLongTextField.defaultProps = {
    addLabel: true,
};

EnhancedLongTextField.propTypes = {
    ...Typography.propTypes,
    ...fieldPropTypes,
};

EnhancedLongTextField.displayName = 'EnhancedLongTextField';

export default EnhancedLongTextField;

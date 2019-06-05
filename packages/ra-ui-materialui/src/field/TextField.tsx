import React, { SFC } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import pure from 'recompose/pure';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const TextField: SFC<FieldProps & InjectedFieldProps & TypographyProps> = ({
    className,
    source,
    record = {},
    ...rest
}) => {
    const value = get(record, source);
    return (
        <Typography component="span" variant="body1" className={className} {...sanitizeRestProps(rest)}>
            {value && typeof value !== 'string' ? JSON.stringify(value) : value}
        </Typography>
    );
};

// wat? TypeScript looses the displayName if we don't set it explicitly
TextField.displayName = 'TextField';

const EnhancedTextField = pure(TextField);

EnhancedTextField.defaultProps = {
    addLabel: true,
};

EnhancedTextField.propTypes = {
    ...Typography.propTypes,
    ...fieldPropTypes,
};

EnhancedTextField.displayName = 'EnhancedTextField';

export default EnhancedTextField;

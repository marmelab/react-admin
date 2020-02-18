import React, { FunctionComponent, HtmlHTMLAttributes } from 'react';
import get from 'lodash/get';
import pure from 'recompose/pure';
import Typography from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

const EmailField: FunctionComponent<
    FieldProps & InjectedFieldProps & HtmlHTMLAttributes<HTMLAnchorElement>
> = ({ className, source, record = {}, emptyText, ...rest }) => {
    const value = get(record, source);

    if (value == null) {
        return emptyText ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeRestProps(rest)}
            >
                {emptyText}
            </Typography>
        ) : null;
    }

    return (
        <a
            className={className}
            href={`mailto:${value}`}
            onClick={stopPropagation}
            {...sanitizeRestProps(rest)}
        >
            {value}
        </a>
    );
};

const EnhancedEmailField = pure<
    FieldProps & HtmlHTMLAttributes<HTMLAnchorElement>
>(EmailField);

EnhancedEmailField.defaultProps = {
    addLabel: true,
};

EnhancedEmailField.propTypes = fieldPropTypes;
EnhancedEmailField.displayName = 'EnhancedEmailField';

export default EnhancedEmailField;

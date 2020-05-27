import React, { FunctionComponent, HtmlHTMLAttributes, memo } from 'react';
import get from 'lodash/get';
import sanitizeRestProps from './sanitizeRestProps';
import { Typography, Link } from '@material-ui/core';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

const EmailField: FunctionComponent<
    FieldProps & InjectedFieldProps & HtmlHTMLAttributes<HTMLAnchorElement>
> = memo<
    FieldProps & InjectedFieldProps & HtmlHTMLAttributes<HTMLAnchorElement>
>(({ className, source, record = {}, emptyText, ...rest }) => {
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
        <Link
            className={className}
            href={`mailto:${value}`}
            onClick={stopPropagation}
            {...sanitizeRestProps(rest)}
        >
            {value}
        </Link>
    );
});

EmailField.defaultProps = {
    addLabel: true,
};

EmailField.propTypes = fieldPropTypes;

export default EmailField;

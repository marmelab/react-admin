import React, { FunctionComponent, HtmlHTMLAttributes } from 'react';
import get from 'lodash/get';
import pure from 'recompose/pure';
import sanitizeRestProps from './sanitizeRestProps';
import { Typography, Link } from '@material-ui/core';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const UrlField: FunctionComponent<
    FieldProps & InjectedFieldProps & HtmlHTMLAttributes<HTMLAnchorElement>
> = ({ className, emptyText, source, record = {}, ...rest }) => {
    const value = get(record, source);

    if (value == null && emptyText) {
        return (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeRestProps(rest)}
            >
                {emptyText}
            </Typography>
        );
    }

    return (
        <Link className={className} href={value} {...sanitizeRestProps(rest)}>
            {value}
        </Link>
    );
};

const EnhancedUrlField = pure<
    FieldProps & HtmlHTMLAttributes<HTMLAnchorElement>
>(UrlField);

EnhancedUrlField.defaultProps = {
    addLabel: true,
};

EnhancedUrlField.propTypes = fieldPropTypes;
EnhancedUrlField.displayName = 'EnhancedUrlField';

export default EnhancedUrlField;

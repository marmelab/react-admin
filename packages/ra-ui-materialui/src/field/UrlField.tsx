import * as React from 'react';
import { FunctionComponent, HtmlHTMLAttributes, memo } from 'react';
import get from 'lodash/get';
import sanitizeRestProps from './sanitizeRestProps';
import { Typography, Link } from '@material-ui/core';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const UrlField: FunctionComponent<
    FieldProps & InjectedFieldProps & HtmlHTMLAttributes<HTMLAnchorElement>
> = memo<
    FieldProps & InjectedFieldProps & HtmlHTMLAttributes<HTMLAnchorElement>
>(({ className, emptyText, source, record = {}, ...rest }) => {
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
});

UrlField.defaultProps = {
    addLabel: true,
};

UrlField.propTypes = fieldPropTypes;
UrlField.displayName = 'UrlField';

export default UrlField;

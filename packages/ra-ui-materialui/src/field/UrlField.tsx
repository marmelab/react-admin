import * as React from 'react';
import { FC, HtmlHTMLAttributes, memo } from 'react';
import get from 'lodash/get';
import sanitizeRestProps from './sanitizeRestProps';
import { Typography, Link } from '@material-ui/core';
import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const UrlField: FC<UrlFieldProps> = memo<UrlFieldProps>(
    ({ className, emptyText, source, record = {}, ...rest }) => {
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
            <Link
                className={className}
                href={value}
                {...sanitizeRestProps(rest)}
            >
                {value}
            </Link>
        );
    }
);

UrlField.defaultProps = {
    addLabel: true,
};

UrlField.propTypes = fieldPropTypes;
UrlField.displayName = 'UrlField';

export interface UrlFieldProps
    extends PublicFieldProps,
        InjectedFieldProps,
        HtmlHTMLAttributes<HTMLAnchorElement> {}

export default UrlField;

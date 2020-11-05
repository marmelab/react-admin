import * as React from 'react';
import { FC, AnchorHTMLAttributes, memo } from 'react';
import get from 'lodash/get';
import sanitizeFieldRestProps from './sanitizeFieldRestProps';
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
                    {...sanitizeFieldRestProps(rest)}
                >
                    {emptyText}
                </Typography>
            );
        }

        return (
            <Link
                className={className}
                href={value}
                {...sanitizeFieldRestProps(rest)}
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
        AnchorHTMLAttributes<HTMLAnchorElement> {}

export default UrlField;

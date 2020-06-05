import * as React from 'react';
import { FunctionComponent, HtmlHTMLAttributes, memo } from 'react';
import get from 'lodash/get';
import Typography from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';
import { Link } from '@material-ui/core';

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

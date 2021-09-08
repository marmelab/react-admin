import * as React from 'react';
import { AnchorHTMLAttributes, memo } from 'react';
import get from 'lodash/get';
import Typography from '@material-ui/core/Typography';
import { Link } from '@material-ui/core';
import { useRecordContext } from 'ra-core';

import sanitizeFieldRestProps from './sanitizeFieldRestProps';
import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

const EmailField = memo<EmailFieldProps>((props: EmailFieldProps) => {
    const { className, source, emptyText, ...rest } = props;
    const record = useRecordContext(props);
    const value = get(record, source);

    if (value == null) {
        return emptyText ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
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
            {...sanitizeFieldRestProps(rest)}
        >
            {value}
        </Link>
    );
});
// @ts-ignore
EmailField.defaultProps = {
    addLabel: true,
};
// @ts-ignore
EmailField.propTypes = fieldPropTypes;

export interface EmailFieldProps
    extends PublicFieldProps,
        InjectedFieldProps,
        AnchorHTMLAttributes<HTMLAnchorElement> {}

export default EmailField;

import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Link, LinkProps } from '@mui/material';
import { useFieldValue, useTranslate } from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { FieldProps } from './types';
import { genericMemo } from './genericMemo';

const EmailFieldImpl = <
    RecordType extends Record<string, any> = Record<string, any>,
>(
    props: EmailFieldProps<RecordType>
) => {
    const { className, emptyText, ...rest } = props;
    const value = useFieldValue(props);
    const translate = useTranslate();

    if (value == null) {
        return emptyText ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                {emptyText && translate(emptyText, { _: emptyText })}
            </Typography>
        ) : null;
    }

    return (
        <Link
            className={className}
            href={`mailto:${value}`}
            onClick={stopPropagation}
            variant="body2"
            {...sanitizeFieldRestProps(rest)}
        >
            {value}
        </Link>
    );
};
EmailFieldImpl.displayName = 'EmailFieldImpl';

export const EmailField = genericMemo(EmailFieldImpl);

export interface EmailFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends FieldProps<RecordType>,
        Omit<LinkProps, 'textAlign'> {}

// useful to prevent click bubbling in a Datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

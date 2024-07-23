import * as React from 'react';
import { AnchorHTMLAttributes } from 'react';
import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { Typography, Link } from '@mui/material';
import { useFieldValue, useTranslate } from 'ra-core';
import { FieldProps } from './types';
import { genericMemo } from './genericMemo';

const UrlFieldImpl = <
    RecordType extends Record<string, any> = Record<string, any>,
>(
    props: UrlFieldProps<RecordType>
) => {
    const { className, emptyText, content, ...rest } = props;
    const value = useFieldValue(props);
    const translate = useTranslate();

    if (value == null) {
        return (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                {emptyText && translate(emptyText, { _: emptyText })}
            </Typography>
        );
    }

    return (
        <Link
            className={className}
            href={value}
            onClick={stopPropagation}
            variant="body2"
            {...sanitizeFieldRestProps(rest)}
        >
            {content ?? value}
        </Link>
    );
};
UrlFieldImpl.displayName = 'UrlFieldImpl';

export const UrlField = genericMemo(UrlFieldImpl);

export interface UrlFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends FieldProps<RecordType>,
        AnchorHTMLAttributes<HTMLAnchorElement> {
    content?: string;
}

// useful to prevent click bubbling in a Datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

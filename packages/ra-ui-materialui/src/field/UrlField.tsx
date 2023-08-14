import * as React from 'react';
import { AnchorHTMLAttributes } from 'react';
import get from 'lodash/get';
import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { Typography, Link } from '@mui/material';
import { useRecordContext, useTranslate } from 'ra-core';
import { FieldProps, fieldPropTypes } from './types';
import { genericMemo } from './genericMemo';

const UrlFieldImpl = <
    RecordType extends Record<string, any> = Record<string, any>
>(
    props: UrlFieldProps<RecordType>
) => {
    const { className, emptyText, source, ...rest } = props;
    const record = useRecordContext(props);
    const value = get(record, source);
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
            {value}
        </Link>
    );
};

UrlFieldImpl.propTypes = fieldPropTypes;
UrlFieldImpl.displayName = 'UrlFieldImpl';

export const UrlField = genericMemo(UrlFieldImpl);

export interface UrlFieldProps<
    RecordType extends Record<string, any> = Record<string, any>
> extends FieldProps<RecordType>,
        AnchorHTMLAttributes<HTMLAnchorElement> {}

// useful to prevent click bubbling in a Datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

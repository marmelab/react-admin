import * as React from 'react';
import get from 'lodash/get';
import Typography from '@mui/material/Typography';
import { Link, LinkProps } from '@mui/material';
import { Call, Objects } from 'hotscript';
import { useRecordContext, useTranslate } from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';
import { genericMemo } from './genericMemo';

const EmailFieldImpl = <
    RecordType extends Record<string, unknown> = Record<string, unknown>
>(
    props: EmailFieldProps<RecordType>
) => {
    const { className, source, emptyText, ...rest } = props;
    const record = useRecordContext(props);
    const value = get(record, source);
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

export const EmailField = genericMemo(EmailFieldImpl);

// @ts-ignore
EmailField.propTypes = fieldPropTypes;
// @ts-ignore
EmailField.displayName = 'EmailField';

export interface EmailFieldProps<
    RecordType extends Record<string, unknown> = Record<string, unknown>
> extends PublicFieldProps,
        InjectedFieldProps<RecordType>,
        Omit<LinkProps, 'textAlign'> {
    source?: unknown extends RecordType
        ? string
        : Call<Objects.AllPaths, RecordType>;
    sortBy?: unknown extends RecordType
        ? string
        : Call<Objects.AllPaths, RecordType>;
}

// useful to prevent click bubbling in a Datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

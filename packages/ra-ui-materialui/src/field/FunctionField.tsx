import * as React from 'react';
import { useMemo, ReactNode } from 'react';
import { useRecordContext } from 'ra-core';
import Typography, { TypographyProps } from '@mui/material/Typography';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { FieldProps } from './types';

/**
 * Field using a render function
 *
 * @example
 * <FunctionField
 *     source="last_name" // used for sorting
 *     label="Name"
 *     render={record => `${record.first_name} ${record.last_name}`}
 * />
 */

export const FunctionField = <RecordType extends Record<string, any> = any>(
    props: FunctionFieldProps<RecordType>
) => {
    const { className, source = '', render, ...rest } = props;
    const record = useRecordContext(props);
    return useMemo(
        () =>
            record ? (
                <Typography
                    component="span"
                    variant="body2"
                    className={className}
                    {...sanitizeFieldRestProps(rest)}
                >
                    {render(record, source)}
                </Typography>
            ) : null,
        [className, record, source, render, rest]
    );
};

export interface FunctionFieldProps<
    RecordType extends Record<string, any> = any,
> extends Omit<FieldProps<RecordType>, 'source'>,
        Omit<TypographyProps, 'textAlign'> {
    source?: string;
    render: (record: RecordType, source?: string) => ReactNode;
}

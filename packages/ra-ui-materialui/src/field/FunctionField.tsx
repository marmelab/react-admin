import * as React from 'react';
import { useMemo } from 'react';
import { useRecordContext } from 'ra-core';
import PropTypes from 'prop-types';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { Call, Objects } from 'hotscript';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';

/**
 * Field using a render function
 *
 * @example
 * <FunctionField
 *     source="last_name" // used for sorting
 *     label="Name"
 *     render={record => record && `${record.first_name} ${record.last_name}`}
 * />
 */

export const FunctionField = <
    RecordType extends Record<string, unknown> = Record<string, unknown>
>(
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

FunctionField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    render: PropTypes.func.isRequired,
};

export interface FunctionFieldProps<
    RecordType extends Record<string, unknown> = Record<string, unknown>
> extends PublicFieldProps,
        InjectedFieldProps<RecordType>,
        Omit<TypographyProps, 'textAlign'> {
    render: (record?: RecordType, source?: string) => any;
    source?: unknown extends RecordType
        ? string
        : Call<Objects.AllPaths, RecordType>;
    sortBy?: unknown extends RecordType
        ? string
        : Call<Objects.AllPaths, RecordType>;
}

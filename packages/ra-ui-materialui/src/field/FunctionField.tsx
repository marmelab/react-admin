import * as React from 'react';
import { useMemo } from 'react';
import { Record, useRecordContext } from 'ra-core';
import PropTypes from 'prop-types';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

import sanitizeFieldRestProps from './sanitizeFieldRestProps';
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
const FunctionField = <RecordType extends Record = Record>(
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

FunctionField.defaultProps = {
    addLabel: true,
};

FunctionField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    render: PropTypes.func.isRequired,
};

export interface FunctionFieldProps<RecordType extends Record = Record>
    extends PublicFieldProps,
        InjectedFieldProps<RecordType>,
        TypographyProps {
    render: (record?: RecordType, source?: string) => any;
}

export default FunctionField;

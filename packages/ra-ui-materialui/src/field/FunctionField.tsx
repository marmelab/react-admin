import React, { SFC } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import Typography from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps } from './types';

interface Props extends FieldProps {
    render: (record: object, source: string) => any;
}

/**
 * @example
 * <FunctionField source="last_name" label="Name" render={record => `${record.first_name} ${record.last_name}`} />
 */
const FunctionField: SFC<Props> = ({
    className,
    record = {},
    source,
    render,
    ...rest
}) =>
    record ? (
        <Typography
            component="span"
            variant="body1"
            className={className}
            {...sanitizeRestProps(rest)}
        >
            {render(record, source)}
        </Typography>
    ) : null;

const PureFunctionField = pure(FunctionField);

PureFunctionField.defaultProps = {
    addLabel: true,
};

export default PureFunctionField;

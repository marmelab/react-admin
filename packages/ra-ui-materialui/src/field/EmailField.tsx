import React, { SFC } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import pure from 'recompose/pure';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps } from './types';

const EmailField: SFC<FieldProps> = ({
    className,
    source,
    record = {},
    ...rest
}) => (
    <a
        className={className}
        href={`mailto:${get(record, source)}`}
        {...sanitizeRestProps(rest)}
    >
        {get(record, source)}
    </a>
);

const PureEmailField = pure(EmailField);

PureEmailField.defaultProps = {
    addLabel: true,
};

export default PureEmailField;

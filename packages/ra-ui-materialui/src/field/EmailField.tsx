import React, { FunctionComponent, HtmlHTMLAttributes } from 'react';
import get from 'lodash/get';
import pure from 'recompose/pure';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

const EmailField: FunctionComponent<
    FieldProps & InjectedFieldProps & HtmlHTMLAttributes<HTMLAnchorElement>
> = ({ className, source, record = {}, ...rest }) => (
    <a
        className={className}
        href={`mailto:${get(record, source)}`}
        onClick={stopPropagation}
        {...sanitizeRestProps(rest)}
    >
        {get(record, source)}
    </a>
);

const EnhancedEmailField = pure<
    FieldProps & HtmlHTMLAttributes<HTMLAnchorElement>
>(EmailField);

EnhancedEmailField.defaultProps = {
    addLabel: true,
};

EnhancedEmailField.propTypes = fieldPropTypes;
EnhancedEmailField.displayName = 'EnhancedEmailField';

export default EnhancedEmailField;

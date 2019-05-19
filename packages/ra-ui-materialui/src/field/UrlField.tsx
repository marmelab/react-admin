import React, { SFC, HtmlHTMLAttributes } from 'react';
import get from 'lodash/get';
import pure from 'recompose/pure';
import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const UrlField: SFC<
    FieldProps & InjectedFieldProps & HtmlHTMLAttributes<HTMLAnchorElement>
> = ({ className, source, record = {}, ...rest }) => (
    <a
        className={className}
        href={get(record, source)}
        {...sanitizeRestProps(rest)}
    >
        {get(record, source)}
    </a>
);

const EnhancedUrlField = pure<
    FieldProps & HtmlHTMLAttributes<HTMLAnchorElement>
>(UrlField);

EnhancedUrlField.defaultProps = {
    addLabel: true,
};

EnhancedUrlField.propTypes = fieldPropTypes;
EnhancedUrlField.displayName = 'EnhancedUrlField';

export default EnhancedUrlField;

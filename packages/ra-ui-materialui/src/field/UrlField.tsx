import React, { FunctionComponent, HtmlHTMLAttributes } from 'react';
import get from 'lodash/get';
import pure from 'recompose/pure';
import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const UrlField: FunctionComponent<
    FieldProps & InjectedFieldProps & HtmlHTMLAttributes<HTMLAnchorElement>
> = ({ className, emptyText, source, record = {}, ...rest }) => {
    const value = get(record, source);

    if (value === null && emptyText) {
        return <span className={className}>{emptyText}</span>;
    }

    return (
        <a className={className} href={value} {...sanitizeRestProps(rest)}>
            {value}
        </a>
    );
};

const EnhancedUrlField = pure<
    FieldProps & HtmlHTMLAttributes<HTMLAnchorElement>
>(UrlField);

EnhancedUrlField.defaultProps = {
    addLabel: true,
};

EnhancedUrlField.propTypes = fieldPropTypes;
EnhancedUrlField.displayName = 'EnhancedUrlField';

export default EnhancedUrlField;

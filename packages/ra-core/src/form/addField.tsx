import React, { ReactType } from 'react';
import FormField from './FormField';

export default (
    BaseComponent: ReactType,
    fieldProps: {
        [key: string]: any;
    } = {}
) => {
    const WithFormField = props => (
        <FormField component={BaseComponent} {...fieldProps} {...props} />
    );
    return WithFormField;
};

import React from 'react';
import FormField from './FormField';

export default (BaseComponent, fieldProps = {}) => {
    const WithFormField = props => (
        <FormField component={BaseComponent} {...fieldProps} {...props} />
    );
    return WithFormField;
};

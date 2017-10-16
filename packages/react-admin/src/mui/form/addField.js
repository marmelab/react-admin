import React from 'react';
import FormField from './FormField';

export default BaseComponent => {
    const WithFormField = props => (
        <FormField component={BaseComponent} {...props} />
    );
    return WithFormField;
};

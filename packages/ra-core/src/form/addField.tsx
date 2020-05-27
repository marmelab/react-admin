import * as React from 'react';
import { ElementType } from 'react';
import FormField from './FormField';

export default (
    BaseComponent: ElementType<any>,
    fieldProps: {
        [key: string]: any;
    } = {}
) => {
    const WithFormField = props => (
        <FormField component={BaseComponent} {...fieldProps} {...props} />
    );
    return WithFormField;
};

import React from 'react';
import FormInput from './FormInput';

const FormTab = ({ label, icon, children, ...rest }) => (
    <span>
        {React.Children.map(
            children,
            input => (input ? <FormInput input={input} {...rest} /> : null)
        )}
    </span>
);

export default FormTab;

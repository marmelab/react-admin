import React from 'react';
import FormInput from './FormInput';

const FormTab = ({ label, icon, children, ...rest }) => (
    <span>
        {React.Children.map(
            children,
            input =>
                input && (
                    <FormInput
                        className={input.props.className}
                        input={input}
                        {...rest}
                    />
                )
        )}
    </span>
);

export default FormTab;

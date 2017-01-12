import React from 'react';
import FormField from './FormField';

const FormTab = ({ label, icon, children, ...rest }) => <span>
    {React.Children.map(children, input => (
        <div key={input.props.source} style={input.props.style}>
            <FormField input={input} {...rest} />
        </div>
    ))}
</span>;

export default FormTab;

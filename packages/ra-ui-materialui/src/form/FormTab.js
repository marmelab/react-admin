import React from 'react';
import PropTypes from 'prop-types';
import FormInput from './FormInput';

const sanitizeRestProps = ({ label, icon, ...rest }) => rest;

const FormTab = ({ children, ...rest }) => (
    <span>
        {React.Children.map(
            children,
            input =>
                input && (
                    <FormInput input={input} {...sanitizeRestProps(rest)} />
                )
        )}
    </span>
);

FormTab.propTypes = {
    children: PropTypes.node,
};

export default FormTab;

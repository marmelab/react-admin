import React from 'react';
import PropTypes from 'prop-types';
import FormInput from './FormInput';

const sanitizeRestProps = ({ label, icon, ...rest }) => rest;

const hiddenStyle = { display: 'none' };

const FormTab = ({ children, hidden, ...rest }) => (
    <span style={hidden ? hiddenStyle : null}>
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
    hidden: PropTypes.bool,
};

export default FormTab;

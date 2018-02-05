import React from 'react';
import PropTypes from 'prop-types';
import SimpleFormLayoutFactory from './SimpleFormLayoutFactory';
import FormTabLayout from './FormTabLayout';

const FormTab = ({ render = FormTabLayout, ...rest }) => (
    <SimpleFormLayoutFactory render={render} {...rest} />
);
FormTab.propTypes = {
    render: PropTypes.func,
};

export default FormTab;

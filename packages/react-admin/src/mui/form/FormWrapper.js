import React from 'react';
import PropTypes from 'prop-types';
import Form from './Form';

const defaultRenderer = (Component, props) => <Component {...props} />;

const FormWrapper = ({ render, ...props }) => render(Form, props);

FormWrapper.propTypes = {
    render: PropTypes.func,
};
FormWrapper.defaultProps = {
    render: defaultRenderer,
};

export default FormWrapper;

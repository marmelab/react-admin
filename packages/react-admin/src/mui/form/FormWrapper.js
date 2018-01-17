import PropTypes from 'prop-types';
import Form from './Form';

const FormWrapper = ({ render, ...props }) =>
    render({
        ...props,
        defaultRenderer: Form,
    });

FormWrapper.propTypes = {
    render: PropTypes.func,
};
FormWrapper.defaultProps = {
    render: Form,
};

export default FormWrapper;

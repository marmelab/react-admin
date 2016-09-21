import React from 'react';
import { Field, reduxForm } from 'redux-form';
import TextInput from '../input/TextInput';

const validate = values => {
    const errors = {};
    const requiredFields = ['title', 'teaser'];
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required';
        }
    });

    return errors;
};

const CreateForm = ({ handleSubmit, children }) => {
    return (
        <form onSubmit={handleSubmit}>
            {React.Children.map(children, input => <div key={input.props.source}>
                <Field name={input.props.source} component={input.type} {...input.props} />
            </div>)}
        </form>
    );
};

export default reduxForm({
    form: 'CreateForm',  // a unique identifier for this form
    validate,
})(CreateForm);

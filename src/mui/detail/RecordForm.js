import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { SaveButton } from '../button';
import { Labeled } from '../input';

let validators = {};

const validate = (values) => {
    const errors = {};

    for (const key in validators) {
        if (!validators[key]) {
            continue;
        }

        const errorMessage = validators[key](values[key]);
        if (errorMessage) {
            errors[key] = errorMessage;
        }
    }

    return errors;
};

const RecordForm = ({ children, handleSubmit, record, resource, basePath }) => {
    validators = {};
    React.Children.map(children, input => {
        const { source, validation } = input.props;
        validators[source] = validation;
    });

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ padding: '0 1em 1em 1em' }}>
                {React.Children.map(children, input => {
                    return (
                        <div key={input.props.source}>
                            {
                                input.props.reference ?
                                    <Labeled
                                        label={input.props.label}
                                        resource={resource}
                                        record={record}
                                        basePath={basePath}
                                    >
                                        {input}
                                    </Labeled>
                                    :
                                    <Field
                                        {...input.props}
                                        name={input.props.source}
                                        component={input.type}
                                    />
                            }
                        </div>
                    );
                })}
            </div>
            <Toolbar>
                <ToolbarGroup>
                    <SaveButton />
                </ToolbarGroup>
            </Toolbar>
        </form>
    );
};

RecordForm.propTypes = {
    children: PropTypes.array,
    handleSubmit: PropTypes.func,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
};

export default reduxForm({
    form: 'record-form',
    validate,
})(RecordForm);

import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import validate from '../../util/validate';
import { SaveButton } from '../button';
import Labeled from '../input/Labeled';

export const validateForm = (values, { children, validation }) => {
    const errors = {};

    const constraints = {};
    for (const fieldName in validation) {
        constraints[fieldName] = [validation[fieldName]];
    }

    React.Children.map(children, child => {
        const { source, validation } = child.props;
        if (!validation) {
            return;
        }

        if (typeof constraints[source] === 'undefined') {
            constraints[source] = [validation];
        } else {
            constraints[source].push(validation);
        }
    });

    for (const fieldName in constraints) {
        if (!constraints[fieldName] || !constraints[fieldName].length) {
            continue;
        }

        const errorMessage = validate(values, fieldName, constraints[fieldName]);
        if (errorMessage) {
            errors[fieldName] = errorMessage;
        }
    }

    return errors;
};

export const RecordForm = ({ children, handleSubmit, record, resource, basePath }) => (
    <form onSubmit={handleSubmit}>
        <div style={{ padding: '0 1em 1em 1em' }}>
            {React.Children.map(children, input => (
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
            ))}
        </div>
        <Toolbar>
            <ToolbarGroup>
                <SaveButton />
            </ToolbarGroup>
        </Toolbar>
    </form>
);

RecordForm.propTypes = {
    children: PropTypes.node    ,
    handleSubmit: PropTypes.func,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
};

export default reduxForm({
    form: 'record-form',
    validate: validateForm,
})(RecordForm);

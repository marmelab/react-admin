import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { getConstraintsFunctionFromFunctionOrObject } from '../../util/validate';
import { SaveButton } from '../button';
import Labeled from '../input/Labeled';

/**
 * @example
 * from the following fields:
 *     <TextField source="title" validation={{ minLength: 5 }} />
 *     <TextField source="age" validation={{ required: true, min: 18 }} />
 * produces the following output
 * {
 *    title: (value) => value.length < 5 ? ['title is too short'] : [],
 *    age:   (value) => {
 *       const errors = [];
 *       if (value) errors.push('age is required');
 *       if (value < 18) errors.push('age is under 18');
 *       return errors;
 *    }
 * }
 */
const getFieldConstraints = (children) => React.Children.toArray(children)
    .map(({ props: { source: fieldName, validation }}) => ({ fieldName, validation }))
    .filter(({ validation }) => !!validation)
    .reduce((constraints, { fieldName, validation }) => {
        constraints[fieldName] = getConstraintsFunctionFromFunctionOrObject(validation);
        return constraints;
    }, {});

export const validateForm = (values, { children, validation }) => {
    const errors = typeof validation === 'function' ? validation(values) : {};

    // warn user we expect an object here, in case of validation just returned an error message
    if (errors === null || typeof errors !== 'object') {
        throw new Error('Validation function given to form components should return an object.');
    }

    const fieldConstraints = getFieldConstraints(children);
    Object.keys(fieldConstraints).forEach(fieldName => {
        const error = fieldConstraints[fieldName](values[fieldName], values);
        if (error.length > 0) {
            if (!errors[fieldName]) {
                errors[fieldName] = [];
            }
            errors[fieldName] = [...errors[fieldName], ...error];
        }
    });
    return errors;
};

export const RecordForm = ({ children, handleSubmit, record, resource, basePath }) => (
    <form onSubmit={handleSubmit}>
        <div style={{ padding: '0 1em 1em 1em' }}>
            {React.Children.map(children, input => (
                <div key={input.props.source} style={input.props.style}>
                    { input.props.requiresField ?
                        (input.props.includesLabel ?
                            <Field
                                {...input.props}
                                name={input.props.source}
                                component={input.type}
                                resource={resource}
                                record={record}
                                basePath={basePath}
                            />
                            :
                            <Field
                                {...input.props}
                                name={input.props.source}
                                component={Labeled}
                                label={input.props.label}
                                resource={resource}
                                record={record}
                                basePath={basePath}
                            >{ input }</Field>
                        ) :
                        (input.props.includesLabel ?
                            React.cloneElement(input, { resource, record, basePath }) :
                            <Labeled label={input.props.label} source={input.props.source} resource={resource} record={record} basePath={basePath}>{input}</Labeled>

                        )
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
    children: PropTypes.node,
    handleSubmit: PropTypes.func,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
};

export default reduxForm({
    form: 'record-form',
    validate: validateForm,
})(RecordForm);

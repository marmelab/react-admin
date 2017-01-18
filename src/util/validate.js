import React from 'react';

/* eslint-disable no-underscore-dangle */
/* @link http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const isEmpty = (value) => (typeof value === 'undefined' || value === null || value === '');

/* eslint-disable no-confusing-arrow */
export const coreConstraints = {
    required: (value) => isEmpty(value) ? 'Required field' : null,
    min: (value, _, min) => !isEmpty(value) && (isNaN(parseInt(value, 10)) || parseInt(value, 10) < min) ? `Minimum value: ${min}` : null,
    max: (value, _, max) => !isEmpty(value) && (isNaN(parseInt(value, 10)) || parseInt(value, 10) > max) ? `Maximum value: ${max}` : null,
    minLength: (value, _, min) => isEmpty(value) || `${value}`.length < min ? `Minimum length: ${min}` : null,
    maxLength: (value, _, max) => !isEmpty(value) && `${value}`.length > max ? `Maximum length: ${max}` : null,
    email: (value) => !isEmpty(value) && !EMAIL_REGEX.test(value) ? 'Must be a valid email' : null,
    regex: (value, _, { pattern, message }) => !isEmpty(value) && !pattern.test(value) ? message : null,
    choices: (value, _, { list, message }) => !isEmpty(value) && list.indexOf(value) === -1 ? message : null,
    custom: (value, values, func) => func(value, values),
};

/**
 * Combine multiple constraints into a single function
 *
 * @param {Object} constraints Constraints object; e.g. { required: true, min: 3 }
 *
 * @return {function} A function (value, values) => [errors]
 */
const getConstraintsFunction = constraints => (value, values) => Object.keys(constraints)
    .filter(constraintName => coreConstraints[constraintName])
    .map(constraintName => {
        const constraint = coreConstraints[constraintName];
        constraint._name = constraintName; // .name does not exist on IE
        return constraint;
    })
    .reduce((errors, constraint) => [
        ...errors,
        constraint(value, values, constraints[constraint.name]),
    ], [])
    .filter(error => error !== null);

export const getConstraintsFunctionFromFunctionOrObject = (constraints) => {
    if (typeof constraints === 'function') return constraints;
    if (!Array.isArray(constraints) && typeof constraints === 'object') return getConstraintsFunction(constraints);
    throw new Error('Unsupported validation type');
};

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
export const getFieldConstraints = children => React.Children.toArray(children)
    .map(({ props: { source: fieldName, validation } }) => ({ fieldName, validation }))
    .filter(({ validation }) => !!validation)
    .reduce((constraints, { fieldName, validation }) => {
        constraints[fieldName] = getConstraintsFunctionFromFunctionOrObject(validation); // eslint-disable-line no-param-reassign
        return constraints;
    }, {});

export const getErrorsForForm = (validation, values) => {
    const errorsForForm = typeof validation === 'function' ? validation(values) : {};
    // warn user we expect an object here, in case of validation just returned an error message
    if (errorsForForm === null || typeof errorsForForm !== 'object') {
        throw new Error('Validation function given to form components should return an object.');
    }
    return errorsForForm;
};

export const getErrorsForFieldConstraints = (fieldConstraints, values) => {
    const errors = {};
    Object.keys(fieldConstraints).forEach((fieldName) => {
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

/**
 * Validator function for redux-form
 */
export const validateForm = (values, { children, validation }) => ({
    ...getErrorsForForm(validation, values),
    ...getErrorsForFieldConstraints(getFieldConstraints(children), values),
});

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
const getConstraintsFunction = (constraints) => (value, values) => Object.keys(constraints)
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

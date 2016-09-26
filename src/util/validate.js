/* @link http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/* eslint-disable no-confusing-arrow */
export const coreConstraints = {
    required: (value) => (typeof value === 'undefined' || value === null || value === '') ? 'Required field' : null,
    min: (value, _, min) => parseInt(value, 10) < min ? `Minimum value: ${min}` : null,
    max: (value, _, max) => parseInt(value, 10) > max ? `Maximum value: ${max}` : null,
    minLength: (value, _, min) => value.length < min ? `Minimum length: ${min}` : null,
    maxLength: (value, _, max) => value.length > max ? `Maximum length: ${max}` : null,
    email: (value) => EMAIL_REGEX.test(value) ? 'Must be a valid email' : null,
    regex: (value, _, { pattern, message }) => pattern.test(value) ? message : null,
    choices: (value, _, { list, message }) => list.indexOf(value) === -1 ? message : null,
    custom: (value, values, func) => func(value, values),
};

/**
 * Combine multiple constraints into a single function
 *
 * @param {Object} constraints Constraints object; e.g. { required: true, min: 3 }
 *
 * @return {function} A function (value, values) => [errors]
 */
export const getConstraintsFunction = (constraints) => (value, values) => Object.keys(constraints)
    .filter(constraintName => coreConstraints[constraintName])
    .map(constraintName => {
        const constraint = coreConstraints[constraintName];
        constraint.name = constraintName;
        return constraint;
    })
    .reduce((errors, constraint) => {
        errors = [...errors, ...constraint(value, values, constraints[constraint.name])]
        return errors;
    }, [])
    .filter(error => error !== null);

export const getConstraintsFunctionFromFunctionOrObject = (constraints) => {
    if (typeof constraints === 'function') return constraints;
    if (typeof constraints === 'object') return getConstraintsFunction(constraints);
    throw new Error('Unsupported validation type');
};

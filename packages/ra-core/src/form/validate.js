import lodashMemoize from 'lodash/memoize';

/* eslint-disable no-underscore-dangle */
/* @link http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape

const isEmpty = value =>
    typeof value === 'undefined' || value === null || value === '';

const getMessage = (message, messageArgs, value, values, props) =>
    typeof message === 'function'
        ? message({
              args: messageArgs,
              value,
              values,
              ...props,
          })
        : props.translate(message, {
              _: message,
              ...messageArgs,
          });

// If we define validation functions directly in JSX, it will
// result in a new function at every render, and then trigger infinite re-render.
// Hence, we memoize every built-in validator to prevent a "Maximum call stack" error.
const memoize = fn => lodashMemoize(fn, (...args) => JSON.stringify(args));

export const required = memoize((message = 'ra.validation.required') =>
    Object.assign(
        (value, values, props) =>
            isEmpty(value)
                ? getMessage(message, undefined, value, values, props)
                : undefined,
        { isRequired: true },
    ),
);

export const minLength = memoize(
    (min, message = 'ra.validation.minLength') => (value, values, props) =>
        !isEmpty(value) && value.length < min
            ? getMessage(message, { min }, value, values, props)
            : undefined,
);

export const maxLength = memoize(
    (max, message = 'ra.validation.maxLength') => (value, values, props) =>
        !isEmpty(value) && value.length > max
            ? getMessage(message, { max }, value, values, props)
            : undefined,
);

export const minValue = memoize(
    (min, message = 'ra.validation.minValue') => (value, values, props) =>
        !isEmpty(value) && value < min
            ? getMessage(message, { min }, value, values, props)
            : undefined,
);

export const maxValue = memoize(
    (max, message = 'ra.validation.maxValue') => (value, values, props) =>
        !isEmpty(value) && value > max
            ? getMessage(message, { max }, value, values, props)
            : undefined,
);

// tslint:disable-next-line:variable-name
export const number = memoize(
    (message = 'ra.validation.number') => (value, values, props) =>
        !isEmpty(value) && isNaN(Number(value))
            ? getMessage(message, undefined, value, values, props)
            : undefined,
);

export const regex = lodashMemoize(
    (pattern, message = 'ra.validation.regex') => (value, values, props) =>
        !isEmpty(value) && typeof value === 'string' && !pattern.test(value)
            ? getMessage(message, { pattern }, value, values, props)
            : undefined,
    (pattern, message) => {
        return pattern.toString() + message;
    },
);

export const email = memoize((message = 'ra.validation.email') =>
    regex(EMAIL_REGEX, message),
);

const oneOfTypeMessage = ({ list }, value, values, { translate }) => {
    translate('ra.validation.oneOf', {
        options: list.join(', '),
    });
};

export const choices = memoize(
    (list, message = oneOfTypeMessage) => (value, values, props) =>
        !isEmpty(value) && list.indexOf(value) === -1
            ? getMessage(message, { list }, value, values, props)
            : undefined,
);

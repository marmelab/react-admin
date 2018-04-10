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

export const required = (message = 'ra.validation.required') =>
    Object.assign(
        (value, values, props) =>
            isEmpty(value)
                ? getMessage(message, undefined, value, values, props)
                : undefined,
        { isRequired: true }
    );

export const minLength = (min, message = 'ra.validation.minLength') => (
    value,
    values,
    props
) =>
    !isEmpty(value) && value.length < min
        ? getMessage(message, { min }, value, values, props)
        : undefined;

export const maxLength = (max, message = 'ra.validation.maxLength') => (
    value,
    values,
    props
) =>
    !isEmpty(value) && value.length > max
        ? getMessage(message, { max }, value, values, props)
        : undefined;

export const minValue = (min, message = 'ra.validation.minValue') => (
    value,
    values,
    props
) =>
    !isEmpty(value) && value < min
        ? getMessage(message, { min }, value, values, props)
        : undefined;

export const maxValue = (max, message = 'ra.validation.maxValue') => (
    value,
    values,
    props
) =>
    !isEmpty(value) && value > max
        ? getMessage(message, { max }, value, values, props)
        : undefined;

export const number = (message = 'ra.validation.number') => (
    value,
    values,
    props
) =>
    !isEmpty(value) && isNaN(Number(value))
        ? getMessage(message, undefined, value, values, props)
        : undefined;

export const regex = (pattern, message = 'ra.validation.regex') => (
    value,
    values,
    props
) =>
    !isEmpty(value) && typeof value === 'string' && !pattern.test(value)
        ? getMessage(message, { pattern }, value, values, props)
        : undefined;

export const email = (message = 'ra.validation.email') =>
    regex(EMAIL_REGEX, message);

const oneOfTypeMessage = ({ list }, value, values, { translate }) => {
    translate('ra.validation.oneOf', {
        options: list.join(', '),
    });
};
export const choices = (list, message = oneOfTypeMessage) => (
    value,
    values,
    props
) =>
    !isEmpty(value) && list.indexOf(value) === -1
        ? getMessage(message, { list }, value, values, props)
        : undefined;

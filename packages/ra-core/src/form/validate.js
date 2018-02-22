/* eslint-disable no-underscore-dangle */
/* @link http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape

const isEmpty = value =>
    typeof value === 'undefined' || value === null || value === '';

export const required = (value, _, props) =>
    isEmpty(value) ? props.translate('ra.validation.required') : undefined;

export const minLength = (min, message) => (value, _, props) =>
    !isEmpty(value) && value.length < min
        ? props.translate(message || 'ra.validation.minLength', {
              min,
              _: message,
          })
        : undefined;

export const maxLength = (max, message) => (value, _, props) =>
    !isEmpty(value) && value.length > max
        ? props.translate(message || 'ra.validation.maxLength', {
              max,
              _: message,
          })
        : undefined;

export const minValue = (min, message) => (value, _, props) =>
    !isEmpty(value) && value < min
        ? props.translate(message || 'ra.validation.minValue', {
              min,
              _: message,
          })
        : undefined;

export const maxValue = (max, message) => (value, _, props) =>
    !isEmpty(value) && value > max
        ? props.translate(message || 'ra.validation.maxValue', {
              max,
              _: message,
          })
        : undefined;

export const number = (value, _, props) =>
    !isEmpty(value) && isNaN(Number(value))
        ? props.translate('ra.validation.number')
        : undefined;

export const regex = (pattern, message) => (value, _, props) =>
    !isEmpty(value) && typeof value === 'string' && !pattern.test(value)
        ? props.translate(message, { _: message })
        : undefined;

export const email = regex(EMAIL_REGEX, 'ra.validation.email');

export const choices = (list, message) => (value, _, props) =>
    !isEmpty(value) && list.indexOf(value) === -1
        ? props.translate(message, { _: message })
        : undefined;

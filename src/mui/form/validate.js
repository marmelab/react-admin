/* eslint-disable no-underscore-dangle */
/* @link http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const isEmpty = value => (typeof value === 'undefined' || value === null || value === '');

export const required = (value, _, props) => isEmpty(value) ? props.translate('aor.validation.required') : undefined;

export const minLength = min => (value, _, props) =>
    value && value.length < min ? props.translate('aor.validation.minLength', { min }) : undefined;

export const maxLength = max => (value, _, props) =>
    value && value.length > max ? props.translate('aor.validation.maxLength', { max }) : undefined;

export const minValue = min => (value, _, props) =>
    value && value < min ? props.translate('aor.validation.minValue', { min }) : undefined;

export const maxValue = max => (value, _, props) =>
    value && value > max ? props.translate('aor.validation.maxValue', { max }) : undefined;

export const number = (value, _, props) => value && isNaN(Number(value)) ? props.translate('aor.validation.number') : undefined;

export const regex = (pattern, message) => (value, _, props) =>
    value && typeof value === 'string' && !pattern.test(value) ? props.translate(message) : undefined;

export const email = regex(EMAIL_REGEX, 'aor.validation.email');

export const choices = (list, message) => (value, _, props) =>
    value && list.indexOf(value) === -1 ? props.translate(message) : undefined;

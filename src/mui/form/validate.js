/* eslint-disable no-underscore-dangle */
/* @link http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const isEmpty = value => (typeof value === 'undefined' || value === null || value === '');

export const required = value => isEmpty(value) ? 'Required field' : undefined;

export const minLength = min => value =>
    value && value.length <= min ? `Must be ${min} characters at least` : undefined;

export const maxLength = max => value =>
    value && value.length >= max ? `Must be ${max} characters or less` : undefined;

export const minValue = min => value =>
    value && value <= min ? `Must be at least ${min}` : undefined;

export const maxValue = max => value =>
    value && value >= max ? `Must be ${max} or less` : undefined;

export const number = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined;

export const regex = (pattern, message) => value =>
    value && !pattern.test(value) ? message : undefined;

export const email = regex(EMAIL_REGEX, 'Must be a valid email');

export const choices = (list, message) => value =>
    value && list.indexOf(value) === -1 ? message : undefined;

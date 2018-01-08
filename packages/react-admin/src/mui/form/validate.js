/* eslint-disable no-underscore-dangle */
/* @link http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape

const isEmpty = value =>
    typeof value === 'undefined' || value === null || value === '';

export const required = value =>
    isEmpty(value) ? 'ra.validation.required' : undefined;

export const minLength = (min, message) => value =>
    !isEmpty(value) && value.length < min
        ? [
              message || 'ra.validation.minLength',
              {
                  min,
                  _: message,
              },
          ]
        : undefined;

export const maxLength = (max, message) => value =>
    !isEmpty(value) && value.length > max
        ? [
              message || 'ra.validation.maxLength',
              {
                  max,
                  _: message,
              },
          ]
        : undefined;

export const minValue = (min, message) => value =>
    !isEmpty(value) && value < min
        ? [
              message || 'ra.validation.minValue',
              {
                  min,
                  _: message,
              },
          ]
        : undefined;

export const maxValue = (max, message) => value =>
    !isEmpty(value) && value > max
        ? [
              message || 'ra.validation.maxValue',
              {
                  max,
                  _: message,
              },
          ]
        : undefined;

export const number = value =>
    !isEmpty(value) && isNaN(Number(value))
        ? 'ra.validation.number'
        : undefined;

export const regex = (pattern, message) => value =>
    !isEmpty(value) && typeof value === 'string' && !pattern.test(value)
        ? [message, { _: message }]
        : undefined;

export const email = regex(EMAIL_REGEX, 'ra.validation.email');

export const choices = (list, message) => value =>
    !isEmpty(value) && list.indexOf(value) === -1
        ? [message, { _: message }]
        : undefined;

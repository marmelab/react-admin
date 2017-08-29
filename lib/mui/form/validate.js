'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* eslint-disable no-underscore-dangle */
/* @link http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var isEmpty = function isEmpty(value) {
    return typeof value === 'undefined' || value === null || value === '';
};

var required = exports.required = function required(value, _, props) {
    return isEmpty(value) ? props.translate('aor.validation.required') : undefined;
};

var minLength = exports.minLength = function minLength(min, message) {
    return function (value, _, props) {
        return value && value.length < min ? props.translate(message || 'aor.validation.minLength', { min: min }) : undefined;
    };
};

var maxLength = exports.maxLength = function maxLength(max, message) {
    return function (value, _, props) {
        return value && value.length > max ? props.translate(message || 'aor.validation.maxLength', { max: max }) : undefined;
    };
};

var minValue = exports.minValue = function minValue(min, message) {
    return function (value, _, props) {
        return value && value < min ? props.translate(message || 'aor.validation.minValue', { min: min }) : undefined;
    };
};

var maxValue = exports.maxValue = function maxValue(max, message) {
    return function (value, _, props) {
        return value && value > max ? props.translate(message || 'aor.validation.maxValue', { max: max }) : undefined;
    };
};

var number = exports.number = function number(value, _, props) {
    return value && isNaN(Number(value)) ? props.translate('aor.validation.number') : undefined;
};

var regex = exports.regex = function regex(pattern, message) {
    return function (value, _, props) {
        return value && typeof value === 'string' && !pattern.test(value) ? props.translate(message) : undefined;
    };
};

var email = exports.email = regex(EMAIL_REGEX, 'aor.validation.email');

var choices = exports.choices = function choices(list, message) {
    return function (value, _, props) {
        return value && list.indexOf(value) === -1 ? props.translate(message) : undefined;
    };
};
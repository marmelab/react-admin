import { shallowEqual } from 'recompose';

const isObject = obj =>
    obj && Object.prototype.toString.call(obj) === '[object Object]';
const isEmpty = obj =>
    obj instanceof Date
        ? false
        : obj === '' || obj === null || shallowEqual(obj, {});

const removeEmpty = object =>
    Object.keys(object).reduce((acc, key) => {
        let child = object[key];

        if (isObject(object[key])) {
            child = removeEmpty(object[key]);
        }

        return isEmpty(child) ? acc : { ...acc, [key]: child };
    }, {});

export default removeEmpty;

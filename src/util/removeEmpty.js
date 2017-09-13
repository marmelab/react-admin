import { shallowEqual } from 'recompose';

const isObject = obj =>
    obj && Object.prototype.toString.call(obj) === '[object Object]';
const isEmpty = obj => obj === '' || obj === null || shallowEqual(obj, {});

const removeEmpty = object =>
    Object.keys(object).reduce((acc, key) => {
        const child = isObject(object[key])
            ? removeEmpty(object[key])
            : object[key];
        return isEmpty(child) ? acc : { ...acc, [key]: child };
    }, {});

export default removeEmpty;

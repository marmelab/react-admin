import get from 'lodash/get.js';

export default (value, path) => {
    if (typeof value === 'object') {
        return get(value, path);
    }

    return value;
};

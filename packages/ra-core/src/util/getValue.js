import get from 'lodash/get';

export default (value, path) => {
    if (typeof value === 'object') {
        return get(value, path);
    }

    return value;
};

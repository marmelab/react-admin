const removeKey = (target, path) =>
    Object.keys(target).reduce((acc, key) => {
        if (key !== path) {
            return Object.assign({}, acc, { [key]: target[key] });
        }

        return acc;
    }, {});

const deepRemoveKey = (target, path) => {
    const paths = path.replace(/\[/g, '.').replace(/]/g, '').split('.');

    if (paths.length === 1) {
        return removeKey(target, path);
    }

    const deepKey = paths[0];
    if (target[deepKey] === undefined) {
        return target;
    }
    const deep = deepRemoveKey(target[deepKey], paths.slice(1).join('.'));

    if (Object.keys(deep).length === 0) {
        return removeKey(target, deepKey);
    }

    return Object.assign({}, target, { [deepKey]: deep });
};

export default deepRemoveKey;

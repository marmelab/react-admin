export default children => (data = {}, defaultValue = {}) => {
    const globalDefaultValue = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    const defaultValueFromChildren = children
        .map(child => ({ source: child.props.source, defaultValue: child.props.defaultValue }))
        .reduce((prev, next) => {
            if (next.defaultValue != null) {
                prev[next.source] = typeof next.defaultValue === 'function' ? next.defaultValue() : next.defaultValue; // eslint-disable-line no-param-reassign
            }
            return prev;
        }, {});
    return { ...globalDefaultValue, ...defaultValueFromChildren, ...data };
};

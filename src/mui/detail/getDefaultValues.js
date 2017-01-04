import { Children } from 'react';

export default children => (data = {}, defaultValues = {}) => {
    const childrenDefaultValues = Children.toArray(children)
        .map(child => ({ source: child.props.source, defaultValue: child.props.defaultValue }))
        .reduce((prev, next) => {
            if (next.defaultValue != null) {
                prev[next.source] = next.defaultValue; // eslint-disable-line no-param-reassign
            }
            return prev;
        }, {});
    return { ...defaultValues, ...childrenDefaultValues, ...data };
};

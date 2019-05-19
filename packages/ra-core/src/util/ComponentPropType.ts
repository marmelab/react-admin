import { isValidElementType } from 'react-is';

export default (props, propName, componentName) => {
    if (props[propName] && !isValidElementType(props[propName])) {
        return new Error(
            `Invalid prop '${propName}' supplied to '${componentName}': the prop is not a valid React component`
        );
    }
};

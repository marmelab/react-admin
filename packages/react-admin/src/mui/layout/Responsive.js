import React from 'react';
import PropTypes from 'prop-types';
import withWidth from 'material-ui/utils/withWidth';

export const Responsive = ({ small, medium, large, width, ...rest }) => {
    let element;
    switch (width) {
        case 'xs':
            element = small ? small : medium ? medium : large;
            break;
        case 'sm':
        case 'md':
            element = medium ? medium : large ? large : small;
            break;
        case 'lg':
        case 'xl':
            element = large ? large : medium ? medium : small;
            break;
        default:
            throw new Error(`Unknown width ${width}`);
    }
    return React.cloneElement(element, rest);
};

Responsive.propTypes = {
    small: PropTypes.element,
    medium: PropTypes.element,
    large: PropTypes.element,
    width: PropTypes.string,
};

export default withWidth()(Responsive);

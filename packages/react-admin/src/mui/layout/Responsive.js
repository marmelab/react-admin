import React from 'react';
import PropTypes from 'prop-types';
import withWidth from 'material-ui/utils/withWidth';

export const Responsive = ({ small, medium, large, width, ...rest }) => {
    let element;
    switch (width) {
        case 'xs':
            element =
                typeof small !== 'undefined'
                    ? small
                    : typeof medium !== 'undefined' ? medium : large;
            break;
        case 'sm':
        case 'md':
            element =
                typeof medium !== 'undefined'
                    ? medium
                    : typeof large !== 'undefined' ? large : small;
            break;
        case 'lg':
        case 'xl':
            element =
                typeof large !== 'undefined'
                    ? large
                    : typeof medium !== 'undefined' ? medium : small;
            break;
        default:
            throw new Error(`Unknown width ${width}`);
    }

    return element ? React.cloneElement(element, rest) : null;
};

Responsive.propTypes = {
    small: PropTypes.element,
    medium: PropTypes.element,
    large: PropTypes.element,
    width: PropTypes.string,
};

export default withWidth()(Responsive);

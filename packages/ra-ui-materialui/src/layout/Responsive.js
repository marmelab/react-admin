import React from 'react';
import PropTypes from 'prop-types';
import withWidth from '@material-ui/core/withWidth';

export const Responsive = ({
    xsmall,
    small,
    medium,
    large,
    width,
    ...rest
}) => {
    let element;
    switch (width) {
        case 'xs':
            element =
                typeof xsmall !== 'undefined'
                    ? xsmall
                    : typeof small !== 'undefined'
                        ? small
                        : typeof medium !== 'undefined'
                            ? medium
                            : large;
            break;
        case 'sm':
            element =
                typeof small !== 'undefined'
                    ? small
                    : typeof medium !== 'undefined'
                        ? medium
                        : large;
            break;
        case 'md':
            element =
                typeof medium !== 'undefined'
                    ? medium
                    : typeof large !== 'undefined'
                        ? large
                        : small;
            break;
        case 'lg':
        case 'xl':
            element =
                typeof large !== 'undefined'
                    ? large
                    : typeof medium !== 'undefined'
                        ? medium
                        : small;
            break;
        default:
            throw new Error(`Unknown width ${width}`);
    }

    return element ? React.cloneElement(element, rest) : null;
};

Responsive.propTypes = {
    xsmall: PropTypes.element,
    small: PropTypes.element,
    medium: PropTypes.element,
    large: PropTypes.element,
    width: PropTypes.string,
};

export default withWidth()(Responsive);

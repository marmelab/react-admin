import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export const Responsive = ({ xsmall, small, medium, large, ...rest }) => {
    const theme = useTheme();
    const width =
        [...theme.breakpoints.keys].reverse().reduce((output, key) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const matches = useMediaQuery(theme.breakpoints.only(key));
            return !output && matches ? key : output;
        }, null) || 'xs';
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
};

export default Responsive;

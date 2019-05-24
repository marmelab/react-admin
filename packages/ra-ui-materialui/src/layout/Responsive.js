import React from 'react';
import PropTypes from 'prop-types';
import withWidth from '@material-ui/core/withWidth';

import { ComponentPropType } from 'ra-core';

export const Responsive = ({
    xsmall,
    small,
    medium,
    large,
    width,
    ...rest
}) => {
    let Component;
    switch (width) {
        case 'xs':
            Component =
                typeof xsmall !== 'undefined'
                    ? xsmall
                    : typeof small !== 'undefined'
                    ? small
                    : typeof medium !== 'undefined'
                    ? medium
                    : large;
            break;
        case 'sm':
            Component =
                typeof small !== 'undefined'
                    ? small
                    : typeof medium !== 'undefined'
                    ? medium
                    : large;
            break;
        case 'md':
            Component =
                typeof medium !== 'undefined'
                    ? medium
                    : typeof large !== 'undefined'
                    ? large
                    : small;
            break;
        case 'lg':
        case 'xl':
            Component =
                typeof large !== 'undefined'
                    ? large
                    : typeof medium !== 'undefined'
                    ? medium
                    : small;
            break;
        default:
            throw new Error(`Unknown width ${width}`);
    }

    return Component ? <Component {...rest} /> : null;
};

Responsive.propTypes = {
    xsmall: ComponentPropType,
    small: ComponentPropType,
    medium: ComponentPropType,
    large: ComponentPropType,
    width: PropTypes.string,
};

export default withWidth()(Responsive);

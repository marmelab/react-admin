import React from 'react';
import PropTypes from 'prop-types';
import withWidth, { SMALL, MEDIUM, LARGE } from 'material-ui/utils/withWidth';

export const Responsive = ({ small, medium, large, width, ...rest }) => {
    let component;
    switch (width) {
        case SMALL:
            component = small ? small : medium ? medium : large;
            break;
        case MEDIUM:
            component = medium ? medium : large ? large : small;
            break;
        case LARGE:
            component = large ? large : medium ? medium : small;
            break;
        default:
            throw new Error(`Unknown width ${width}`);
    }
    return React.cloneElement(component, rest);
};

Responsive.propTypes = {
    small: PropTypes.element,
    medium: PropTypes.element,
    large: PropTypes.element,
    width: PropTypes.number,
};

export default withWidth()(Responsive);

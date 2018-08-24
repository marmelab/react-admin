import React from 'react';
import PropTypes from 'prop-types';
import Headroom from 'react-headroom';

const defaultStyle = {
    position: 'fixed',
    zIndex: 1300,
};

const HeadroomCustom = ({ children }) => (
    <Headroom style={defaultStyle}>{children}</Headroom>
);

HeadroomCustom.propTypes = {
    children: PropTypes.node.isRequired,
};

export default HeadroomCustom;

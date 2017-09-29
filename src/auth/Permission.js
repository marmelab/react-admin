import React from 'react';
import PropTypes from 'prop-types';

const Permission = () => (
    <span>
        &lt;Permission&gt; elements are for configuration only and should not be
        rendered
    </span>
);

Permission.propTypes = {
    children: PropTypes.node.isRequired,
    exact: PropTypes.bool,
    value: PropTypes.any,
    resolve: PropTypes.any,
};

export default Permission;

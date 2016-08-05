import React, { PropTypes } from 'react';

const componentPropType = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);

const Resource = () => <span>&lt;Resource&gt; elements are for configuration only and should not be rendered</span>;

Resource.propTypes = {
    name: PropTypes.string.isRequired,
    list: componentPropType,
    edit: componentPropType,
    create: componentPropType,
};

export default Resource;

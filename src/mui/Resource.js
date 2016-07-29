import React, { PropTypes } from 'react';

const componentPropType = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);

const Resource = ({ name, list, edit, create }) => <span>Resource elements are used for configuration only and should never be rendered</span>;

Resource.propTypes = {
    name: PropTypes.string.isRequired,
    list: componentPropType,
    edit: componentPropType,
    create: componentPropType,
};

export default Resource;

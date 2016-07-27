import React, { PropTypes } from 'react';

const Resource = ({ name, list, edit, create }) => <span>Resource elements are used for configuration only and should never be rendered</span>;

Resource.propTypes = {
    name: PropTypes.string.isRequired,
    list: PropTypes.element,
    edit: PropTypes.element,
    create: PropTypes.element,
};

export default Resource;

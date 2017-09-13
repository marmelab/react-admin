import React from 'react';
import PropTypes from 'prop-types';
import ViewListIcon from 'material-ui/svg-icons/action/view-list';

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

const Resource = () => (
    <span>
        &lt;Resource&gt; elements are for configuration only and should not be
        rendered
    </span>
);

Resource.propTypes = {
    name: PropTypes.string.isRequired,
    list: componentPropType,
    create: componentPropType,
    edit: componentPropType,
    show: componentPropType,
    remove: componentPropType,
    icon: componentPropType,
    options: PropTypes.object,
};

Resource.defaultProps = {
    icon: ViewListIcon,
    options: {},
};

export default Resource;

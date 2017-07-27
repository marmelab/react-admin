import React from 'react';
import PropTypes from 'prop-types';
import ViewListIcon from 'material-ui/svg-icons/action/view-list';
import { Route } from 'react-router-dom';

import CrudRoute from './CrudRoute';

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

const Resource = ({ name, list, create, edit, show, remove, options }) =>
    <Route
        path={`/${name}`}
        key={name}
        render={() =>
            <CrudRoute
                resource={name}
                list={list}
                create={create}
                edit={edit}
                show={show}
                remove={remove}
                options={options}
            />}
    />;

Resource.propTypes = {
    name: PropTypes.string.isRequired,
    list: componentPropType,
    create: componentPropType,
    edit: componentPropType,
    show: componentPropType,
    remove: componentPropType,
    icon: componentPropType,
    options: PropTypes.object,
    checkCredentials: PropTypes.func,
};

Resource.defaultProps = {
    icon: ViewListIcon,
    options: {},
};

export default Resource;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ViewListIcon from 'material-ui/svg-icons/action/view-list';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CrudRoute from './CrudRoute';
import { declareResource as declareResourceAction } from './actions';

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

class Resource extends Component {
    constructor(props) {
        super(props);

        props.declareResource({
            name: props.name,
            icon: props.icon,
            showInMenu: !!props.list,
            options: props.options,
        });
    }

    render() {
        const { name, list, create, edit, show, remove, options } = this.props;
        return (
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
            />
        );
    }
}

Resource.propTypes = {
    declareResource: PropTypes.func.isRequired,
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

export default connect(undefined, { declareResource: declareResourceAction })(
    Resource
);

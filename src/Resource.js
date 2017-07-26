import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ViewListIcon from 'material-ui/svg-icons/action/view-list';
import { Route } from 'react-router-dom';
import compose from 'recompose/compose';

import CrudRoute from './CrudRoute';
import { declareResource as declareResourceAction } from './actions';

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

class Resource extends Component {
    componentDidMount() {
        const { declareResource, location, ...resource } = this.props;
        declareResource(resource);
    }

    render() {
        const { name, list, create, edit, show, remove, options, location } = this.props;
        
        return (
            <Route
                path={`/${name}`}
                key={name}
                location={location}
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

export default connect(undefined, { declareResource: declareResourceAction })(Resource);

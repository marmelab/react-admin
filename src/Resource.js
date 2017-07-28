import React, { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import ViewListIcon from 'material-ui/svg-icons/action/view-list';
import { Route } from 'react-router-dom';
import inflection from 'inflection';

import CrudRoute from './CrudRoute';
import MenuItemLink from './mui/layout/MenuItemLink';
import translate from './i18n/translate';

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

const translatedResourceName = (resource, translate) =>
    translate(`resources.${resource.name}.name`, {
        smart_count: 2,
        _:
            resource.options && resource.options.label
                ? translate(resource.options.label, {
                      smart_count: 2,
                      _: resource.options.label,
                  })
                : inflection.humanize(inflection.pluralize(resource.name)),
    });

class Resource extends Component {
    renderMenu() {
        return;
    }

    render() {
        const {
            context,
            create,
            edit,
            icon,
            list,
            name,
            onMenuTap,
            options,
            remove,
            show,
            translate,
        } = this.props;

        if (context === 'menu') {
            return (
                <MenuItemLink
                    key={name}
                    to={`/${name}`}
                    primaryText={translatedResourceName(
                        { name, options },
                        translate
                    )}
                    leftIcon={createElement(icon)}
                    onTouchTap={onMenuTap}
                />
            );
        }

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
    onMenuTap: PropTypes.func,
    translate: PropTypes.func.isRequired,
    context: PropTypes.string,
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

export default translate(Resource);

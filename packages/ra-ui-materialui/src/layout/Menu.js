import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import inflection from 'inflection';
import compose from 'recompose/compose';
import { withStyles, createStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { getResources, useTranslate, ComponentPropType } from 'ra-core';
import DefaultIcon from '@material-ui/icons/ViewList';

import DashboardMenuItem from './DashboardMenuItem';
import MenuItemLink from './MenuItemLink';
import Responsive from '../layout/Responsive';

const styles = createStyles({
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
});

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

const Menu = ({
    classes,
    className,
    dense,
    hasDashboard,
    onMenuClick,
    open,
    pathname,
    resources,
    logout: Logout,
    ...rest
}) => {
    const translate = useTranslate();
    return (
        <div className={classnames(classes.main, className)} {...rest}>
            {hasDashboard && <DashboardMenuItem onClick={onMenuClick} />}
            {resources
                .filter(r => r.hasList)
                .map(resource => (
                    <MenuItemLink
                        key={resource.name}
                        to={`/${resource.name}`}
                        primaryText={translatedResourceName(
                            resource,
                            translate
                        )}
                        leftIcon={
                            resource.icon ? resource.icon : DefaultIcon
                        }
                        onClick={onMenuClick}
                        dense={dense}
                    />
                ))}
            {Logout ? <Responsive xsmall={<Logout />} medium={null} /> : null}
        </div>
    );
};

Menu.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    dense: PropTypes.bool,
    hasDashboard: PropTypes.bool,
    logout: ComponentPropType,
    onMenuClick: PropTypes.func,
    open: PropTypes.bool,
    pathname: PropTypes.string,
    resources: PropTypes.array.isRequired,
};

Menu.defaultProps = {
    onMenuClick: () => null,
};

const mapStateToProps = state => ({
    open: state.admin.ui.sidebarOpen,
    resources: getResources(state),
    pathname: state.router.location.pathname, // used to force redraw on navigation
});

const enhance = compose(
    connect(
        mapStateToProps,
        {}, // Avoid connect passing dispatch in props,
        null,
        {
            areStatePropsEqual: (prev, next) =>
                prev.resources.every(
                    (value, index) => value === next.resources[index] // shallow compare resources
                ) &&
                prev.pathname === next.pathname &&
                prev.open === next.open,
        }
    ),
    withStyles(styles)
);

export default enhance(Menu);

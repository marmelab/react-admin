import React, { FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
// @ts-ignore
import inflection from 'inflection';
import { makeStyles, useMediaQuery, Theme } from '@material-ui/core';
import DefaultIcon from '@material-ui/icons/ViewList';
import classnames from 'classnames';
import { getResources, useTranslate, Translate, ReduxState } from 'ra-core';

import DashboardMenuItem from './DashboardMenuItem';
import MenuItemLink from './MenuItemLink';

const useStyles = makeStyles(
    {
        main: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
        },
    },
    { name: 'RaMenu' }
);

const translatedResourceName = (resource: any, translate: Translate) =>
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

const Menu: FC<MenuProps> = ({
    classes: classesOverride,
    className,
    dense,
    hasDashboard,
    onMenuClick,
    logout,
    ...rest
}) => {
    const translate = useTranslate();
    const classes = useStyles({ classes: classesOverride });
    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('xs')
    );
    const open = useSelector((state: ReduxState) => state.admin.ui.sidebarOpen);
    const resources = useSelector(getResources, shallowEqual) as Array<any>;

    // Used to force redraw on navigation
    useSelector((state: ReduxState) => state.router.location.pathname);

    return (
        <div className={classnames(classes.main, className)} {...rest}>
            {hasDashboard && (
                <DashboardMenuItem
                    onClick={onMenuClick}
                    dense={dense}
                    sidebarIsOpen={open}
                />
            )}
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
                            resource.icon ? <resource.icon /> : <DefaultIcon />
                        }
                        onClick={onMenuClick}
                        dense={dense}
                        sidebarIsOpen={open}
                    />
                ))}
            {isXSmall && logout}
        </div>
    );
};

export interface MenuProps {
    classes?: object;
    className?: string;
    dense?: boolean;
    hasDashboard: boolean;
    logout?: ReactElement;
    onMenuClick?: () => void;
}

Menu.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    dense: PropTypes.bool,
    hasDashboard: PropTypes.bool,
    logout: PropTypes.element,
    onMenuClick: PropTypes.func,
};

Menu.defaultProps = {
    onMenuClick: () => null,
};

export default Menu;

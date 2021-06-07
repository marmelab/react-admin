import * as React from 'react';
import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import lodashGet from 'lodash/get';
// @ts-ignore
import { useMediaQuery, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { ReduxState } from 'ra-core';

import { DashboardMenuItem } from 'react-admin';
import { NewResourceMenuItem } from './NewResourceMenuItem';
import { useResourcesConfiguration } from '../ResourceConfiguration';
import { ResourceMenuItem } from './ResourceMenuItem';

export const MENU_WIDTH = 240;
export const CLOSED_MENU_WIDTH = 55;

export const Menu = (props: MenuProps) => {
    const {
        classes: classesOverride,
        className,
        dense,
        hasDashboard,
        onMenuClick,
        logout,
        ...rest
    } = props;

    const classes = useStyles(props);
    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('xs')
    );
    const open = useSelector((state: ReduxState) => state.admin.ui.sidebarOpen);
    const [resources] = useResourcesConfiguration();

    return (
        <>
            <div
                className={classnames(
                    classes.main,
                    {
                        [classes.open]: open,
                        [classes.closed]: !open,
                    },
                    className
                )}
                {...rest}
            >
                {hasDashboard && (
                    <DashboardMenuItem
                        onClick={onMenuClick}
                        dense={dense}
                        sidebarIsOpen={open}
                    />
                )}
                {Object.keys(resources).map(resource => (
                    <ResourceMenuItem
                        key={resource}
                        resource={resources[resource]}
                        onClick={onMenuClick}
                        dense={dense}
                        sidebarIsOpen={open}
                    />
                ))}
                <NewResourceMenuItem
                    onClick={onMenuClick}
                    dense={dense}
                    sidebarIsOpen={open}
                />
                {isXSmall && logout}
            </div>
        </>
    );
};

const useStyles = makeStyles(
    theme => ({
        main: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            marginTop: '0.5em',
            [theme.breakpoints.only('xs')]: {
                marginTop: 0,
            },
            [theme.breakpoints.up('md')]: {
                marginTop: '1.5em',
            },
        },
        open: {
            width: lodashGet(theme, 'menu.width', MENU_WIDTH),
        },
        closed: {
            width: lodashGet(theme, 'menu.closedWidth', CLOSED_MENU_WIDTH),
        },
    }),
    { name: 'RaMenu' }
);

export interface MenuProps {
    classes?: object;
    className?: string;
    dense?: boolean;
    hasDashboard?: boolean;
    logout?: ReactNode;
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

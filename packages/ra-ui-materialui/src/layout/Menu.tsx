import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import lodashGet from 'lodash/get';
import DefaultIcon from '@mui/icons-material/ViewList';
import classnames from 'classnames';
import { useGetResourceLabel, getResources, ReduxState } from 'ra-core';

import DashboardMenuItem from './DashboardMenuItem';
import MenuItemLink from './MenuItemLink';

const PREFIX = 'RaMenu';

const classes = {
    main: `${PREFIX}-main`,
    open: `${PREFIX}-open`,
    closed: `${PREFIX}-closed`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.main}`]: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: '0.5em',
        marginBottom: '1em',
        [theme.breakpoints.only('xs')]: {
            marginTop: 0,
        },
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },

    [`&.${classes.open}`]: {
        width: lodashGet(theme, 'menu.width', MENU_WIDTH),
    },

    [`&.${classes.closed}`]: {
        width: lodashGet(theme, 'menu.closedWidth', CLOSED_MENU_WIDTH),
    },
}));

export const MENU_WIDTH = 240;
export const CLOSED_MENU_WIDTH = 55;

const Menu = (props: MenuProps) => {
    const resources = useSelector(getResources, shallowEqual) as Array<any>;
    const getResourceLabel = useGetResourceLabel();
    const {
        hasDashboard,
        dense,
        children = (
            <>
                {hasDashboard && <DashboardMenuItem dense={dense} />}
                {resources
                    .filter(r => r.hasList)
                    .map(resource => (
                        <MenuItemLink
                            key={resource.name}
                            to={{
                                pathname: `/${resource.name}`,
                                state: { _scrollToTop: true },
                            }}
                            primaryText={getResourceLabel(resource.name, 2)}
                            leftIcon={
                                resource.icon ? (
                                    <resource.icon />
                                ) : (
                                    <DefaultIcon />
                                )
                            }
                            dense={dense}
                        />
                    ))}
            </>
        ),
        className,
        onMenuClick,
        logout,
        ...rest
    } = props;

    const open = useSelector((state: ReduxState) => state.admin.ui.sidebarOpen);

    return (
        <Root
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
            {children}
        </Root>
    );
};

export interface MenuProps {
    children?: ReactNode;
    className?: string;
    dense?: boolean;
    hasDashboard?: boolean;
    /**
     * @deprecated
     */
    logout?: ReactNode;
    /**
     * @deprecated
     */
    onMenuClick?: () => void;
}

Menu.propTypes = {
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

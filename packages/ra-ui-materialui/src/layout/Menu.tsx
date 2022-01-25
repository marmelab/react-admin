import * as React from 'react';
import { ReactNode, createElement } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import lodashGet from 'lodash/get';
import DefaultIcon from '@mui/icons-material/ViewList';
import classnames from 'classnames';
import {
    useResourceDefinitions,
    useGetResourceLabel,
    ReduxState,
    useCreatePath,
} from 'ra-core';

import { DashboardMenuItem } from './DashboardMenuItem';
import { MenuItemLink } from './MenuItemLink';

export const Menu = (props: MenuProps) => {
    const resources = useResourceDefinitions();
    const getResourceLabel = useGetResourceLabel();
    const createPath = useCreatePath();
    const {
        hasDashboard,
        dense,
        children = (
            <>
                {hasDashboard && <DashboardMenuItem dense={dense} />}
                {Object.keys(resources)
                    .filter(name => resources[name].hasList)
                    .map(name => (
                        <MenuItemLink
                            key={name}
                            to={createPath({
                                resource: name,
                                type: 'list',
                            })}
                            state={{ _scrollToTop: true }}
                            primaryText={getResourceLabel(name, 2)}
                            leftIcon={
                                resources[name].icon ? (
                                    createElement(resources[name].icon)
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
        ...rest
    } = props;

    const open = useSelector((state: ReduxState) => state.admin.ui.sidebarOpen);

    return (
        <Root
            className={classnames(
                MenuClasses.main,
                {
                    [MenuClasses.open]: open,
                    [MenuClasses.closed]: !open,
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
}

Menu.propTypes = {
    className: PropTypes.string,
    dense: PropTypes.bool,
    hasDashboard: PropTypes.bool,
};

const PREFIX = 'RaMenu';

export const MenuClasses = {
    main: `${PREFIX}-main`,
    open: `${PREFIX}-open`,
    closed: `${PREFIX}-closed`,
};

const Root = styled('div', { name: PREFIX })(({ theme }) => ({
    [`&.${MenuClasses.main}`]: {
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

    [`&.${MenuClasses.open}`]: {
        width: lodashGet(theme, 'menu.width', MENU_WIDTH),
    },

    [`&.${MenuClasses.closed}`]: {
        width: lodashGet(theme, 'menu.closedWidth', CLOSED_MENU_WIDTH),
    },
}));

export const MENU_WIDTH = 240;
export const CLOSED_MENU_WIDTH = 50;
